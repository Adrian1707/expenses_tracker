class Expense < ApplicationRecord
  belongs_to :category

  def self.ransackable_associations(auth_object = nil)
    ["category"]
  end

  def self.ransackable_attributes(auth_object = nil)
   ["amount", "category_id", "created_at", "description", "expense_date", "id", "id_value", "one_off", "purchase_date", "updated_at"]
  end

  def self.current_month_grouped_by_category(month, chart_type = 'regulars')
    expense_scope = select("amount, expense_date, one_off, categories.title AS category_title")
     .joins(:category)
     .where("DATE_PART('month', expense_date) = ?", month.to_i)
     .order(:expense_date)

    expense_scope = expense_scope.where('expense_date < ?', Date.tomorrow) if Date.current.month == month.to_i
    if chart_type == 'regulars'
      expense_scope = expense_scope.where(one_off: false)
    elsif chart_type == 'totals'
      expense_scope = expense_scope.where(one_off: [true, false])
    elsif chart_type == 'one_offs'
      expense_scope = expense_scope.where(one_off: [true])
    end

    expense_scope.map {|e| e.attributes}.group_by {|expense| expense['category_title']}
  end

  def self.current_month_grouped_by_expense_date(month, chart_type = 'regulars')
    expense_scope = select("amount, expense_date, one_off, categories.title AS category_title")
    .joins(:category)
    .where("DATE_PART('month', expense_date) = ?", month.to_i)
    .order(:expense_date)

    expense_scope = expense_scope.where('expense_date < ?', Date.tomorrow) if Date.current.month == month.to_i
    if chart_type == 'regulars'
      expense_scope = expense_scope.where(one_off: false)
    elsif chart_type == 'totals'
      expense_scope = expense_scope.where(one_off: [true, false])
    elsif chart_type == 'one_offs'
      expense_scope = expense_scope.where(one_off: [true])
    end

    expense_scope.map {|e| e.attributes}.group_by {|expense| expense['expense_date'].strftime("%d/%m/%Y")}
  end
end
