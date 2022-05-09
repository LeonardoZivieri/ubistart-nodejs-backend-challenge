const { execSync } = require("child_process");
const NodeEnvironment = require("jest-environment-node");
const { resolve, join } = require("path");
const { v4: uuid } = require("uuid")
const { PrismaClient } = require("@prisma/client");

const prismaCliExec = resolve(join(__dirname, "..", "node_modules", ".bin", "prisma"));

require("dotenv").config({
    path: resolve(join(__dirname, "..", ".env.test")),
    override: false,
})

class CustomEnvironment extends NodeEnvironment {
    constructor(config, context) {
        super(config, context);

        this.generateUniqueIdentifiers();
    }

    generateUniqueIdentifiers() {
        this.schema = "_" + Date.now().toString(36);
        this.connectionString = `${process.env.DATABASE_URL}${this.schema}`
    }

    get connectionStringDetails() {
        const [connectionString, user, password, host, port, database] = /^mysql:\/\/([^:]*):([^@]*)@([^:]*):([^:]*)\/(.*)$/.exec(this.connectionString);
        return { connectionString, user, password, host, port, database }
    }

    async setup() {
        await super.setup();

        this.generateUniqueIdentifiers();

        process.env.DATABASE_URL = this.connectionString;
        this.global.process.env.DATABASE_URL = this.connectionString;

        await this.prismaTestConnection();

        try {
            const prismaCliDbPush = execSync(`${prismaCliExec} db push`).toString();
        } catch (error) {
            if (error.message.includes("already exists on the database server")) {
                // Do nothing, normal
            } else {
                console.error('prismaCliDbPush error')
                console.error(error.message)
            }
        }
    }

    async teardown() {
        await this.prismaTestConnection();

        const prismaClient = new PrismaClient({
            log: []
        });

        try {
            await prismaClient.$executeRaw`DROP DATABASE IF EXISTS \`${this.connectionStringDetails.database}\`;`;
        } catch (error) { }

        await super.teardown();
    }

    async prismaTestConnection() {
        const timeout = Date.now() + (30 * 1000)

        while (true) {
            if (timeout < Date.now()) {
                throw new Error("Connection Error")
            }

            const response = execSync(`${prismaCliExec} migrate status`);
            if (response.toString().includes("Can't reach database server at")) {
                console.log("Connect retry")
            } else {
                break;
            }
        }
    }
}
module.exports = CustomEnvironment;
