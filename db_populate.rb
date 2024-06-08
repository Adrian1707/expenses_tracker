# FETCH ACCESS TOKEN FROM GOOGLE OAUTH PLAYGROUND
  session = GoogleDrive::Session::from_access_token("ya29.a0AXooCgvPWA7fG9wZZnYiDYV2-4guTA3rMCy9GI4TAgWvG9GQBa66S_CCvEDENXU0iJq_3rlHMw2sY5FwGw4M74oaWJmdRX_Pe6s1j1Uskv1Fn_bdBAHZFNfJ_2ZTyRM6sJSjuMYgCZlIVHwZ4TflN52Ve29kafykCgNXaCgYKATcSARMSFQHGX2MiQ5NVJ4tvmfXEsK01uWvi_w0171")
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
