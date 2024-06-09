Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  get 'expenses/index'
  get 'expenses/by_date'
  get 'expenses/by_category'
  get 'categories/index'
  post 'expenses/new_expense'
  # Defines the root path route ("/")
  root "expenses#index"
end
