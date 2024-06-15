class QuestionsController < ApplicationController
  def new
    answer = Question.ask(params[:question]).stringify_keys
    print answer
    respond_to do |format|
      format.json { render :json => {
        answer: answer['answer'],
        raw_sql: answer['raw_sql']
      } }
    end
  end
end
