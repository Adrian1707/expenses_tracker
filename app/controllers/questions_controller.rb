class QuestionsController < ApplicationController
  def new
    convo = params[:conversation].split(",")[0]
    answer = Question.ask(convo).stringify_keys
    print answer
    respond_to do |format|
      format.json { render :json => {
        answer: answer['answer'],
        raw_sql: answer['raw_sql']
      } }
    end
  end
end
