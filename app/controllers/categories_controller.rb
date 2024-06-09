class CategoriesController < ApplicationController

  def index
    @categories = Category.select("id, title")
    respond_to do |format|
      format.json { render :json => {
        categories: @categories
      } }
    end
  end
end
