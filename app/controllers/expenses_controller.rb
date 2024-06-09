class ExpensesController < ApplicationController
  skip_before_action :verify_authenticity_token
  protect_from_forgery with: :null_session

  def index
    @month = params['month'].present? ? params['month'] : Date.current.month
    @grouped_expenses_by_expense_date = Expense.current_month_grouped_by_expense_date(@month, params['chart_type'])
    grouped_expenses_by_category = Expense.current_month_grouped_by_category(@month, params['chart_type'])

    monthly_expenses = @grouped_expenses_by_expense_date.values.flatten.sum {|e| e['amount']}

    @grouped_by_category_percentages = grouped_expenses_by_category.transform_values do |expenses|
      sum = expenses.sum { |expense| ((expense["amount"].to_f / monthly_expenses) * 100).to_f.round(1) }
    end.sort_by  {|k,v| v}.reverse.to_h

    @grouped_by_category_values = grouped_expenses_by_category.transform_values do |expenses|
      sum = expenses.sum { |expense| expense['amount'] }
    end.sort_by  {|k,v| v}.reverse.to_h
    if @month.to_i == Date.current.month
      @expenses_today = @grouped_expenses_by_expense_date[Date.today.strftime("%d/%m/%Y")].sum {|e| e['category_title'] != 'Accommodation' ?  e['amount'] : 0}
    end
    @total_monthly_expenses = @grouped_expenses_by_expense_date.values.flatten.sum {|expense| expense['amount']}.round(2)

    respond_to do |format|
      format.html
      format.json { render :json => {
        expenses_by_expense_date: @grouped_expenses_by_expense_date,
        expenses_by_category_percentages: @grouped_by_category_percentages,
        category_values: @grouped_by_category_values,
        expensesToday: @expenses_today,
        totalMonthlyExpenses: @total_monthly_expenses,
        month: @month
      } }
    end
  end

  def by_date
    @expenses = Expense.select("amount, expense_date, categories.title AS category_title", "description", "one_off").joins(:category).where(expense_date: params['date']).order(:expense_date)
    @expenses = JSON.parse(@expenses.to_json).map {|h| h.except("id")}
    @expenses = @expenses.map {|e| e['amount'] = e["amount"].to_s.prepend("£");  e['expense_date'] = Date.parse(e['expense_date']).strftime("%d/%m/%Y"); e}
    respond_to do |format|
      format.json { render :json => {
        expenses_for_date: @expenses,
      } }
    end
  end

  def by_category
    @expenses = Expense
    .select("amount, expense_date, categories.title AS category_title", "description", "one_off")
    .joins(:category)
    .where("DATE_PART('month', expense_date) = ?", params['month'].to_i)
    .where('categories.title = ?', params['category'])
    .order(:expense_date)

    @expenses = JSON.parse(@expenses.to_json).map {|h| h.except("id")}
    @expenses = @expenses.map {|e| e['amount'] = e["amount"].to_s.prepend("£");  e['expense_date'] = Date.parse(e['expense_date']).strftime("%d/%m/%Y"); e}
    respond_to do |format|
      format.json { render :json => {
        expenses_for_category: @expenses,
      } }
    end
  end

  def new_expense
    expense_params = JSON.parse(request.raw_post)
    category = Category.find(expense_params['category_id'])
    if category.title == 'Accommodation'
      start_date = DateTime.parse(expense_params['check_in_date'])
      end_date = DateTime.parse(expense_params['check_out_date'])

      date_array = []
      current_date = start_date

      while current_date < end_date
        date_array << current_date.strftime("%Y-%m-%d")
        current_date = current_date.next_day
      end
      date_array.each do |date|
        Expense.create!(
          category_id: expense_params['category_id'],
          amount: expense_params['amount'] / date_array.length,
          expense_date: date,
          purchase_date: expense_params['purchase_date'],
          description: expense_params['description'],
          one_off: expense_params['one_off']
        )
      end
    else
      Expense.create!(
        category_id: expense_params['category_id'],
        amount: expense_params['amount'],
        expense_date: expense_params['expense_date'],
        purchase_date: expense_params['purchase_date'],
        description: expense_params['description'],
        one_off: expense_params['one_off']
      )
    end
    respond_to do |format|
      format.json { render :json => {
        success: 'ok',
      } }
    end
  end

end
