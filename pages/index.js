import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { MainGrid } from "../src/components/MainGrid";
import { Box } from "../src/components/Box";
import { AlurakutMenu, AlurakutMenuProfileSidebar } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper >
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {
          props.items.map((item, index) => {
            return (
              <li key={item.id}>
                <a href={`/users/${item.login}`} >
                  <img src={item.avatar_url} />
                  <span>{item.login}</span>
                </a>
              </li>
            )
          })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const token = process.env.NEXT_PUBLIC_TOKEN;

  //const url_config = "?per_page=6&page=2"
  const urlGitHub = "https://api.github.com/users/";
  const githubUser = props.githubUser;

  const [following, setFollowing] = React.useState([]);

  const [followers, setFollowers] = React.useState([]);

  const [communitys, setCommunitys] = React.useState([]);

  React.useEffect(() => {

    // API GitHub seguindo
    fetch(`${urlGitHub}${githubUser}/following`)
      .then(async response => {
        const json = await response.json();
        return setFollowing(json);
      })
      .catch((error) => {
        console.log(error);
      });

    // API GitHub seguidores
    fetch(`${urlGitHub}${githubUser}/followers`)
      .then(async response => {
        const json = await response.json();
        return setFollowers(json);
      })
      .catch((error) => {
        console.log(error);
      });

    // API DATOCMS
    fetch(
      'https://graphql.datocms.com/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          query: `query{
            allCommunities(orderBy: id_DESC) {
              id
              title
              imageUrl
              creatorSlug
            }
          }`
        }),
      }
    )
      .then(async res => {
        const response = await res.json();
        setCommunitys(response.data.allCommunities);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <Box as="aside">
            <AlurakutMenuProfileSidebar githubUser={githubUser} />
          </Box >
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem-vindo(a), {props.user.name}
            </h1>
          </Box>
          <Box>
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Minhas Comunidades ({communitys.length})
              </h2>

              <ul>
                {communitys.map((itemAtual) => {
                  return (
                    <li key={itemAtual.id}>
                      <a href={`/communitys/${itemAtual.id}`} >
                        <img src={itemAtual.imageUrl} />
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </ProfileRelationsBoxWrapper>
            <form onSubmit={function handleCreateCommunity(resultEvent) {
              resultEvent.preventDefault();
              const communityDados = new FormData(resultEvent.target);
              const communityTitle = communityDados.get('title');
              const communityImage = communityDados.get('image');

              const community = {
                title: communityTitle,
                imageUrl: communityImage,
                creatorSlug: githubUser,
              };

              fetch('/api/communitys', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(community),
              }).then(async response => {
                const dados = await response.json()
                const community = dados.recordCreated;
                const communitysCreate = [...communitys, community];
                setCommunitys(communitysCreate);
              })

            }}>
              <div>
                <input
                  type="text"
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  name="title"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL da capa"
                  aria-label="Coloque uma URL da capa"
                  name="image" />
              </div>
              <button>Criar Comunidade</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox title="Seguido" items={following} />

          <ProfileRelationsBox title="Seguidores" items={followers} />

        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const decodedToken = jwt.decode(token);
  const githubUser = decodedToken?.githubUser.trim();
  const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
  let isAuthenticated;

  if (!githubUser) {
    return {
      redirect: {
        destination: '/loginPage',
        permanent: false,
      }
    }

  } else if (!isAuthenticated) {
    const response = await fetch(`https://api.github.com/users/${githubUser}`, {
      headers: {
        'Authorization': OAUTH_TOKEN,
      }
    })
    const user = await response.json();

    isAuthenticated = response.ok;

    if (!isAuthenticated) {
      return {
        redirect: {
          destination: '/loginPage',
          permanent: false,
        }
      }
    } else {
      return {
        props: {
          githubUser,
          user
        }
      }
    }
  }
}