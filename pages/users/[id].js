import React from 'react';
import { MainGrid } from "../../src/components/MainGrid";
import { Box } from "../../src/components/Box";
import { AlurakutMenu, AlurakutMenuProfileSidebar, OrkutNostalgicIconSet } from '../../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../../src/components/ProfileRelations';
import { useRouter } from 'next/router'


function ProfileRelationsBox(props) {
    return (
        <ProfileRelationsBoxWrapper >
            <h2 className="smallTitle">
                {props.title} {props.items.length}
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
export default function Home() {

    const { query } = useRouter();

    console.log(query.id);

    const githubUser = (query.id == "undefined" ? query.id : "rafaballerini");

    const url_config = "?per_page=6&page=1"
    const urlGitHub = "https://api.github.com/users/";

    const [communitys, setCommunitys] = React.useState([]);

    const [user, setUser] = React.useState([]);

    const [following, setFollowing] = React.useState([]);

    const [followers, setFollowers] = React.useState([]);

    React.useEffect(() => {

        fetch(`${urlGitHub}${githubUser}`) //Usuario do GitHub
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                setUser(json);
            })
            .catch((error) => {
                console.log(error);
            });

        fetch(`${urlGitHub}${githubUser}/following${url_config}`) //seguindo
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                setFollowing(json);
            })
            .catch((error) => {
                console.log(error);
            });

        fetch(`${urlGitHub}${githubUser}/followers${url_config}`) //seguidores
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                setFollowers(json);
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
                        <AlurakutMenuProfileSidebar user={user} githubUser={githubUser} />
                    </Box >
                </div>
                <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
                    <Box>
                        <h1 className="title">
                            Bem-vindo(a), {user.name}
                        </h1>

                        <OrkutNostalgicIconSet />
                    </Box>
                    <Box>
                        <h2 className="subTitle">
                            O que você gostaria de fazer?
                        </h2>
                        <form onSubmit={function handleCreateCommunity(e) {
                            e.preventDefault();
                            const communityDados = new FormData(e.target);
                            const communityTitle = communityDados.get('title');
                            const communityImage = communityDados.get('image');

                            const community = {
                                id: new Date().toISOString(),
                                title: communityTitle,
                                image: communityImage,
                            };
                            const communitysUpdate = [...communitys, community];
                            setCommunitys(communitysUpdate);

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

                    <ProfileRelationsBoxWrapper>
                        <h2 className="smallTitle">
                            Seguido ({following.length})
                        </h2>

                        <ul>
                            {following.map((itemAtual, index) => {
                                return (
                                    <li key={itemAtual.id}>
                                        <a href={`/users/${itemAtual.login}`} >
                                            <img src={`${itemAtual.avatar_url}`} />
                                            <span>{itemAtual.login}</span>
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </ProfileRelationsBoxWrapper>

                    <ProfileRelationsBox title="Seguidores" items={followers} />

                    <ProfileRelationsBoxWrapper>
                        <h2 className="smallTitle">
                            Comunidades ({communitys.length})
                        </h2>

                        <ul>
                            {communitys.map((itemAtual) => {
                                return (
                                    <li key={itemAtual.id}>
                                        <a href={`/users/${itemAtual.title}`} >
                                            <img src={itemAtual.image} />
                                            <span>{itemAtual.title}</span>
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </ProfileRelationsBoxWrapper>

                </div>
            </MainGrid>
        </>
    )
}
