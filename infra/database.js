import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD
  })  
  
  try {
    await client.connect()
    const result = await client.query(queryObject)
    return result.rows
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    try {
      await client.end()
    } catch (error) {
      console.error('Não há conexão aberta com o banco')
    }
  }
}

export default {
  query: query,
}