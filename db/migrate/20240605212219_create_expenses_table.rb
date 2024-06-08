class CreateExpensesTable < ActiveRecord::Migration[7.1]
  def change
    create_table :expenses do |t|
      t.float :amount, null: false, default: 0.0
      t.references :category, foreign_key: true
      t.string :description, null: true
      t.boolean :one_off, null: false, default: false
      t.datetime :expense_date
      t.datetime :purchase_date
      t.timestamps
    end
  end
end
