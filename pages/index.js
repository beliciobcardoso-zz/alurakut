import { MainGrid } from "../src/components/MainGrid";
import { Box } from "../src/components/Box";
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

const githubUser = "beliciobcardoso";

function ProfileSidebar() {
  return (
    <Box>
      <img src={`https://github.com/${githubUser}.png`} style={{ borderRadius: '8px' }} />
      <p>Belicio Batista Cardoso</p>
    </Box>
  )
}

export default function Home() {
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    'guilhermesilveira'
  ]

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <Box>
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Pessoas da comunidade ({pessoasFavoritas.length})
              </h2>

              <ul>
                {pessoasFavoritas.map((itemAtual) => {
                  return (
                    <li>
                      <a href={`/users/${itemAtual}`} key={itemAtual}>
                        <img src={`https://github.com/${itemAtual}.png`} />
                        <span>{itemAtual}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </ProfileRelationsBoxWrapper>
          </Box>
        </div>
      </MainGrid>
    </>
  )
}
