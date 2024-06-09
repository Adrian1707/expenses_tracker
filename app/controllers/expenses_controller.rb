class ExpensesController < ApplicationController

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
    @expenses = Expense.select("amount, expense_date, categories.title AS category_title", "description", "one_off").joins(:category).where(expense_date: params['date'])
    @expenses = JSON.parse(@expenses.to_json).map {|h| h.except("id")}
    @expenses = @expenses.map {|e| e['amount'] = e["amount"].to_s.prepend("£");  e['expense_date'] = Date.parse(e['expense_date']).strftime("%d/%m/%Y"); e}
    respond_to do |format|
      format.json { render :json => {
        expenses_for_date: @expenses,
      } }
    end
  end

end
