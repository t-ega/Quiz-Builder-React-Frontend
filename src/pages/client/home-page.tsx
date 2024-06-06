import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiRequest from "../../utils/api-request";
import Header from "../../components/header";
import { z } from "zod";
import { IQuizTest, QuizTestSchema } from "../../utils/validations/client";
import Loader from "../../components/loader";
import { useQueries } from "@tanstack/react-query";
import { fetchTestDetails, fetchTestQuestions } from "../../api-requests/quiz";
import LoadingButton from "../../components/loading-button";
import { toast } from "react-toastify";
import { getQuizStartTime, setQuizStartTime } from "../../utils/cookies";
import ErrorPage from "../errors/error";
import { ROUTES } from "../../utils/routes";

interface IHomePageProps {
  setQuizData: React.Dispatch<React.SetStateAction<IQuizTest | null>>;
}

const HomePage = (props: IHomePageProps) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { quizId } = useParams();

  const [{ data, error, isFetching }, testQuestionsQuery] = useQueries({
    queries: [
      {
        queryKey: ["client", "quiz", quizId],
        queryFn: () => fetchTestDetails(quizId!),
        staleTime: 1000 * 60 * 5,
        retry: false,
      },
      {
        queryKey: ["client", "quiz", "questions", quizId],
        queryFn: () => fetchTestQuestions({ quizId: quizId!, email }),
        enabled: false,
        retry: false,
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const start = () => {
    const valid = z.string().email().safeParse(email);

    if (valid.error) {
      displayErrors("Please enter a valid email");
      return;
    }

    testQuestionsQuery.refetch().then((observer) => {
      if (observer.isSuccess) populateQuiz(observer.data);
    });
  };

  const populateQuiz = (queryResults: any) => {
    if (!queryResults) {
      return;
    }

    const { data } = queryResults;

    const transformedData = QuizTestSchema.safeParse({
      email,
      questions: data.quiz.quiz_questions,
      ...data.quiz,
    });

    if (transformedData.error) {
      displayErrors("Unable to load quiz data");
      return;
    }

    const { title, duration, questions } = transformedData.data;
    props.setQuizData({ email, title, duration, questions });

    // if the quiz has a duration then store it in a cookie incase
    // the user close the page and open it again it still remains
    if (duration) {
      const existingCookie = getQuizStartTime(email, quizId!);
      if (!existingCookie) {
        setQuizStartTime(email, quizId!);
      }
    }

    navigate(`${ROUTES.TESTS}/${quizId}/start`);
  };

  const displayErrors = (errors: string[] | string, toastId?: number) => {
    if (Array.isArray(errors)) {
      errors?.map((error) => toast.error(error));
      return;
    }
    toast.error(`❌${errors}`, { toastId: toastId });
  };

  useEffect(() => {
    if (testQuestionsQuery.isError) {
      const message = ApiRequest.extractApiErrors(testQuestionsQuery.error);
      displayErrors(message);
    }
  }, [testQuestionsQuery.error]);

  if (error) {
    const message = ApiRequest.extractApiErrors(error);
    return <ErrorPage message={message} />;
  }

  if (isFetching) return <Loader />;

  return (
    <>
      <Header
        heading={data.data.quiz.user.username}
        styles={{ position: "fixed" }}
        text="Assessment"
      />

      <div
        className="card"
        style={{
          display: "flex",
          padding: 20,
          marginTop: "50px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <hr />
          <p>
            <strong>Cheating is Not Allowed:</strong> Ensure that you complete
            the quiz on your own without any outside help. Any form of cheating
            or academic dishonesty will result in disqualification.
          </p>

          <p>
            <strong>Time Management:</strong> You have a limited time of 30
            minutes to complete the quiz. Keep an eye on the timer and make sure
            to allocate your time wisely across all questions.
          </p>

          <p>
            <strong>Read Carefully:</strong> Read each question and all answer
            choices thoroughly before selecting your answer. Some questions may
            have similar options, so take your time to choose the best one.
          </p>

          <p>
            <strong>Answer All Questions:</strong> Make sure to answer all the
            questions. There is no penalty for guessing, so it’s better to guess
            an answer rather than leave it blank.
          </p>

          <p>
            <strong>No Retakes:</strong> Once you submit your answers, you will
            not be able to retake the quiz. Make sure you are ready before
            starting the quiz.
          </p>

          <p>
            <strong>Stable Internet Connection:</strong> Ensure you have a
            stable internet connection throughout the quiz. Losing connection
            might cause your answers to not be submitted properly.
          </p>

          <p>
            <strong>Environment:</strong> Take the quiz in a quiet place free
            from distractions. This will help you concentrate better and perform
            to the best of your abilities.
          </p>

          <p>
            <strong>Technical Issues:</strong> If you encounter any technical
            issues during the quiz, contact the support team immediately. Do not
            try to resolve it on your own as it might affect your submission.
          </p>

          <p>
            <strong>Use of Resources:</strong> Unless specified, do not use
            textbooks, notes, or any online resources. The quiz is designed to
            test your knowledge and understanding of the subject matter.
          </p>

          <p>
            <strong>Submission:</strong> Once you have answered all questions,
            review your answers before submitting. Make sure you have answered
            everything to the best of your ability.
          </p>
        </div>

        <div style={{ margin: 10 }}>
          <h2>{data.data?.quiz.title}</h2>
          <h3>Quiz Overview</h3>
          <h4>
            Number of questions: <span>{data.data?.quiz.questions_count}</span>
          </h4>
          {data.data?.quiz.duration && (
            <h4>Duration: {data.data?.quiz.duration} mins</h4>
          )}
          <h3>
            To Begin please kindly enter your email address where the quiz was
            sent to
          </h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-control"
          />
          {testQuestionsQuery.isFetching ? (
            <LoadingButton className="action-btn loading" />
          ) : (
            <button
              className="action-btn"
              style={{
                width: "100%",
                display: "inline-block",
                margin: "10px 0px",
              }}
              onClick={() => start()}
            >
              Start
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
