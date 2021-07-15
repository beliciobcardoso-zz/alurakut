import { SiteClient } from 'datocms-client';

export default async function getCommunitys(req, res) {

    if (req.method === 'POST') {
        const tokenDatoCMS = process.env.TOKEN_DATO_CMS;

        const client = new SiteClient(tokenDatoCMS);

        const recordCreated = await client.items.create({
            itemType: '968627',
            ...req.body,
        })
        res.json({
            dados: 'teste',
            recordCreated: recordCreated,
        });
        return;
    }
    res.status(404).json({
        Message: 'Ainda não temos nada no GET, só mo POST!',
    });
}