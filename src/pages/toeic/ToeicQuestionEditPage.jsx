import { useParams } from "react-router-dom";
import QuestionForm from "./ToeicQuestion/QuestionForm";
import { useQuery } from "react-query";
import { fetchQuestionById } from "./ToeicAPI";

const ToeicQuestionEditPage = () => {
    const { questionId, partId } = useParams()

    let question = {
        title: '', note: '-', answers: [], partId
    }

    if (questionId !== undefined) {
        const { data, isLoading, error } = useQuery(['questions-detail', questionId], 
        () => fetchQuestionById(questionId))

        if (isLoading) return 'Loading...';
        if (error) return `An error occurred ${error.message}`;

        question = data;
        if (question.answers) {
            question.answers = question.answers?.map((item) => ({...item, edit: 0}))
        }
    }

     return ( <>
        <QuestionForm initial={question} />
    </> );
}
 
export default ToeicQuestionEditPage;