class Question
  # 128,000 token limit in the context window
  # https://platform.openai.com/docs/models/gpt-4o
  def self.ask(request)
    client = OpenAI::Client.new
    response = client.chat(
      parameters: {
             model: "gpt-4o", # Required.
             messages: [{role: 'system', content: initial_prompt}, { role: "user", content: request}], # Required.
             temperature: 0.7,
      }
    )
    sql = response.dig("choices", 0, "message", "content")
    raw_sql = sql.gsub("\n", " ")
    puts raw_sql
    res = ActiveRecord::Base.connection.execute(raw_sql)

    columns_to_values = Hash[res.fields.zip(res.values.flatten)]
    follow_up = "You will accept a question from a user and an object / hash / dictionary of values.
    This object will contain the name of columns returned as keys, and the values will be the values on those columns
    It is your job is to take the users question and create a nice sounding answer for the user based on their question and using the values provided to you.
    "
    request = "Here is the question: #{request}.


    This is the object / hash with the columns and values: #{columns_to_values}

    Make sure when providing the values back to the user that it makes sense. For instance, the values may look like this:
    {id: 2, amount: 20}
    So in this case you know that the query is returning an object with an id of 2 and an amount of 20.
    Here is another example:
    {expense_date: 2024-05-19 00:00:00 UTC}
    In this case you know that the expense date is returned with a date of May 19th 2024

    Please follow the list of instructions extremely carefully:

    - When refering to any amounts, always quote in British pounds using the £ sign
    - Make sure you compare the valus


    Please give an answer to the users question from the values you can see
    "

    response = client.chat(
      parameters: {
             model: "gpt-4o", # Required.
             messages: [{role: 'system', content: follow_up},{ role: "user", content: request}], # Required.
             temperature: 0.7,
      }
    )

    {answer: response.dig("choices", 0, "message", "content"), raw_sql: raw_sql}
  end

  def self.initial_prompt
    date_prompt = "The date today is #{Date.today.to_s}. "
    prompt =  date_prompt += 'Your task is to take queries in natural english language and convert them to the necessary SQL needed in order to satisfy the users query.
    The user will ask questions like "How much have i spent on Starbucks this past year?" or "What was my most expensive Airbnb?"

    The database schema is just two tables and is designed as follows:

    CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        title VARCHAR,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE expenses (
        id SERIAL PRIMARY KEY,
        amount FLOAT DEFAULT 0.0 NOT NULL,
        category_id BIGINT,
        description VARCHAR,
        one_off BOOLEAN DEFAULT FALSE NOT NULL,
        expense_date TIMESTAMP,
        purchase_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE INDEX index_expenses_on_category_id ON expenses (category_id);

    Some notes on these columns:
    one_off is a column that represents that the expense is a one off expense and not part of regular routine spending
    expense_date is the date the purchase was consumed
    purchase_date is the date the purchase was made

    The key difference between these two date columns can be described as follows:
    If i book a flight in June that takes place in December, then the expense_date for the flight will be December, but the purchase_date
    will be June.

    The categories table is just a static list of categories like so:
    ["Accommodation", "Tour / Activity", "Eating out", "Coffee", "Groceries", "Flight", "Food / Snacks", "Grooming & Apparel", "Public Transport", "Subscription", "Insurance", "Taxis", "Drinks", "Others", "Healthcare", "Gifts"]

    You will assume that the "description" column contains more details about the expense. So for "Accomodation" categories, we will have
    a description which includes the value "Airbnb". You will also assume that the description column contains possible details about the vendor, for instance, Starbucks.

    Please follow the list of instructions extremely carefully:
    - Do not write anything else, just output the raw SQL code without any explanations.
    - When writing SQL with aggregate functions, like COUNT, MAX or MIN, use an "AS" to name the column after the column you are aggregating by. For instance SELECT MAX(expense_date) AS expense_date ...
    - I also do not want you to include any SQL backticks. Just output the raw SQL as it is.
    - Never use purchase_date when performing queries
    - Always default to using expense_date when filtering by date unless the user is interested in specifically in when the item was purchased and the cash transaction was made
    - When filtering by the description field on the expenses table, ALWAYS use LOWER(description) when making the query
    - If the user has mentioned a specific category in their query, please use the categories table when necessary. For instance, if they mention "groceries" or "coffee" or "flights", then because these are categories you will use that table when appropriate
    - Every single response should start with "SELECT" which is the beginning of the SQL query I want

    Your final task will be to output the necessary SQL code needed to fulfil the users request.
    '
  end
end
