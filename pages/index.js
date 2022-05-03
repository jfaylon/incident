import axios from 'axios';
import Login from '../components/login';
import IncidentForm from '../components/IncidentForm';
import IncidentList from '../components/IncidentList';
import { getSession } from '../lib/get-session.js';
const querystring = require('querystring');

axios.defaults.withCredentials = true;

export default function Home(props) {
  const { session } = props;
  if (!session.role && !session.username) {
    return <Login />;
  }

  switch (session.role) {
    case 'Admin':
      return (
        <>
          <IncidentForm userList={props.userList} cookie={props.cookie} />
          <br />
          <label>Incident List</label>
          <IncidentList session={props.session} incidentList={props.incidentList} />
        </>
      );
    case 'User':
      return (
        <>
          <label>Incident List</label>
          <IncidentList session={props.session} incidentList={props.incidentList} />
        </>
      );
    default:
  }
}

export const getServerSideProps = async context => {
  const { req, res } = context;
  const session = await getSession(req, res);
  let userList = {};
  let incidentList = {};
  const { query } = req;
  const queryString = querystring.stringify(query);
  console.log(queryString);
  if (session?.role === 'Admin') {
    userList = await axios.get(`${process.env.BASE_URL}/api/users?role=User`, {
      headers: { Cookie: req.headers['cookie'] },
    });
    incidentList = await axios.get(`${process.env.BASE_URL}/api/incidents?${queryString}`, {
      headers: { Cookie: req.headers['cookie'] },
    });
  }
  if (session?.role === 'User') {
    incidentList = await axios.get(`${process.env.BASE_URL}/api/incidents?${queryString}`, {
      headers: { Cookie: req.headers['cookie'] },
    });
  }
  return {
    props: {
      cookie: req.headers['cookie'],
      incidentList: incidentList.data || {},
      session: JSON.parse(JSON.stringify(session)),
      userList: userList.data || {},
    },
  };
};
