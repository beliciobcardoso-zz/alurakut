import nookies from 'nookies';

export default function logout(ctx) {
    return (
        <>
        </>
    )
}

export async function getServerSideProps(ctx) {

    nookies.destroy(ctx, 'USER_TOKEN')

    return {
        redirect: {
            destination: '/loginPage',
            permanent: false,
        }
    }
}
