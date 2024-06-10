# FETCH ACCESS TOKEN FROM GOOGLE OAUTH PLAYGROUND
  session = GoogleDrive::Session::from_access_token('')
  sheet = session.spreadsheet_by_key("18ZDftAluqIz-GDXNDfce5TI7BNiOVPqTCmjAdsPEGbk")
  worksheet = sheet.worksheet_by_title("Expenses")

  categories = [
      'Accommodation',
      'Tour / Activity',
      'Eating out',
      'Coffee',
      'Groceries',
      'Flight',
      'Food / Snacks',
      'Grooming & Apparel',
      'Public Transport',
      'Subscription',
      'Insurance',
      'Taxis',
      'Drinks',
      'Others',
      'Healthcare',
      'Gifts'
    ]

  categories.each do |category_title|
    Category.create(title: category_title)
  end

  categories = Category.all
  ActiveRecord::Base.connection.execute("TRUNCATE expenses RESTART IDENTITY")
  worksheet.rows[1..-1].each do |row|
    category_id = categories.find {|c| c.title == row[2]}&.id
    next if category_id.nil?
    Expense.create!(
      expense_date: Date.parse(row[0]),
      amount: row[1].gsub!("£", '').to_f,
      description: row[3],
      category_id: categories.find {|c| c.title == row[2]}.id,
      one_off: row[4] == 'TRUE' ? true : false
    )
  end
