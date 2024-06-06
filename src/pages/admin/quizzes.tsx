import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { IComponentProps } from "../../utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import { getQuizzess } from "../../api-requests/quiz";
import Loader from "../../components/loader";
import { formatDate } from "../../utils/format-date";
import { ROUTES } from "../../utils/routes";
import ErrorPage from "../errors/error";
import apiRequest from "../../utils/api-request";

const columns: GridColDef[] = [
  { field: "public_id", headerName: "Id", width: 150 },
  { field: "title", headerName: "Title", width: 150 },
  { field: "quiz_entries_count", headerName: "Invitees" },
  { field: "status", headerName: "Status" },
  {
    field: "duration",
    headerName: "Duration",
    valueFormatter: (value: string) => (value ? `${value} mins` : "Not set"),
  },
  { field: "questions_count", headerName: "Questions" },
  { field: "permalink", headerName: "Permalink" },
  {
    field: "created_at",
    headerName: "Date created",
    valueFormatter: (value: string) => formatDate(value),
  },
];

const Quizzes = (props: IComponentProps) => {
  const { displayErrors } = props;
  const navigate = useNavigate();

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    navigate(`${ROUTES.QUIZZES}/${params.row.public_id}`);
  };

  const quizzes = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzess,
    staleTime: 1000 * 60 * 5,
  });

  if (quizzes.isFetching) return <Loader />;
  if (quizzes.isError) {
    const message = apiRequest.extractApiErrors(quizzes.error);
    displayErrors(message);
    return <ErrorPage message={message} />;
  }

  return (
    <div className="quizzes-overview">
      <div className="new-quiz">
        <Link to={`${ROUTES.QUIZZES}/new`}>
          <button className="action-btn">Create New Quiz</button>
        </Link>
      </div>

      <DataGrid
        rows={quizzes.data?.data}
        sx={{ borderRadius: "20px", minHeight: "200px" }}
        columns={columns}
        onRowClick={handleRowClick}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
};

export default Quizzes;
