import { hash } from 'https://deno.land/x/bcrypt/mod.ts';

import client from '../db/mysql.ts';

const tableName = 'users';

class User {
    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public createdAt: string;

    constructor(id: number, name: string, email: string, password: string, createdAt: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

    static async all() {
        return (await client.execute('SELECT * FROM ??', [tableName])).rows;
    }

    static async findByEmail(email: string) {
        const result = await client.execute('SELECT * FROM ?? WHERE email = ?', [tableName, email]);
        const rows: any = result.rows;

        if (rows.length > 0) {
            return new this(rows[0].id, rows[0].name, rows[0].email, rows[0].password, rows[0].created_at);
        }
        
        return null;
    }

    static async create(params: any) {
        const name = params.name;
        const email = params.email;
        const password = await hash(params.password);

        const result = await client.execute('INSERT INTO ?? (name, email, password) VALUES (?, ?, ?)', [tableName, name, email, password]);
        
        return { userId: result.lastInsertId, userCount: result.affectedRows };
    }

    // static async findBySlug(slug: string) {
    //     const result = await client.execute('SELECT * FROM ?? WHERE slug = ?', [tableName, slug]);
    //     const rows = result.rows;
        
    //     return rows ? new this(rows[0].id, rows[0].title, rows[0].slug, rows[0].content, rows[0].created_at) : null;
    // }

    // async save() {
    //     await client.execute('UPDATE ?? SET title = ?, content = ? WHERE slug = ?', [tableName, this.title, this.content, this.slug]);
    // }

    // async delete() {
    //     await client.execute('DELETE FROM ?? WHERE slug = ?', [tableName, this.slug]);
    // }
}

export default User;
