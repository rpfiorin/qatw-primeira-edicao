import { Queue } from "bullmq";

const connection = {
    host: 'paybank-redis',
    port: 6379,
}

const queueName = 'twoFactorQueue'
// se inscreve na fila
const queue = new Queue(queueName, {connection})

export async function getJob() {
    const jobs = await queue.getJobs() // busca todos os jobs
    return jobs[0].data.code
}

export async function cleanJobs() {
    await queue.obliterate()
}