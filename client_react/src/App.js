import './App.css';
import { gql, useQuery } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return '<p>ローディング中です</p>';
  if (error) return '<p>エラーが発生しています。<p>';

  return (
    <div style={{ margin: '3em' }}>
      <h1>GraphQL</h1>
      {data.users.map((user) => (
        <div key={user.id}>Name: {user.name}</div>
      ))}
    </div>
  );
}

export default App;
