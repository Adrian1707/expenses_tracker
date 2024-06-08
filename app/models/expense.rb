class Expense < ApplicationRecord
  belongs_to :category

  def self.ransackable_associations(auth_object = nil)
    ["category"]
  end

  def self.ransackable_attributes(auth_object = nil)
   ["amount", "category_id", "created_at", "description", "expense_date", "id", "id_value", "one_off", "purchase_date", "updated_at"]
  end

  def self.current_month_grouped_by_category(month, include_one_offs = false)
    expense_scope = select("amount, expense_date, one_off, categories.title AS category_title")
     .joins(:category)
     .where("DATE_PART('month', expense_date) = ?", month.to_i)

    expense_scope = expense_scope.where('expense_date <= ?', Date.today) if Date.current.month == month.to_i
    expense_scope = expense_scope.where(one_off: false) unless include_one_offs

    expense_scope.map {|e| e.attributes}.group_by {|expense| expense['category_title']}
  end

  def self.current_month_grouped_by_expense_date(month, include_one_offs = false)
    expense_scope = select("amount, expense_date, one_off, categories.title AS category_title")
    .joins(:category)
    .where("DATE_PART('month', expense_date) = ?", month.to_i)

    expense_scope = expense_scope.where('expense_date <= ?', Date.today) if Date.current.month == month.to_i
    expense_scope = expense_scope.where(one_off: false) unless include_one_offs

    expense_scope.map {|e| e.attributes}.group_by {|expense| expense['expense_date'].strftime("%d/%m/%Y")}
  end
end
