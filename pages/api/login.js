import jwt from 'jsonwebtoken';

export default async function login(req, res) {
    const githubUser = req.body.githubUser;
    const secret = "quemsobemorre";

    const token = jwt.sign({ githubUser: githubUser, iat: Math.floor(Date.now() / 1000), }, secret, { expiresIn: '7d' });

    res.status(200).json({ token })
}