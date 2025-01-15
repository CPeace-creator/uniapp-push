// dbUtils.js
export default class DBUtils {
	// 构造函数，接收表名参数
	constructor(tableName) {
		this.tableName = tableName;
		this.db = uniCloud.database(); // 获取云数据库实例
	}

	// 添加数据
	async add(data) {
		try {
			const res = await this.db.collection(this.tableName).add(data);
			return res;
		} catch (e) {
			console.error('添加数据失败：', e);
			throw e;
		}
	}

	// 查询数据
	async query(query = {}, options = {}) {
		try {
			const res = await this.db.collection(this.tableName).where(query).get(options);
			return res.data; // 返回查询结果数据
		} catch (e) {
			console.error('查询数据失败：', e);
			throw e;
		}
	}

	// 更新数据
	async update(id, data) {
		try {
			const res = await this.db.collection(this.tableName).doc(id).update(data);
			return res;
		} catch (e) {
			console.error('更新数据失败：', e);
			throw e;
		}
	}

	// 删除数据
	async delete(id) {
		try {
			const res = await this.db.collection(this.tableName).doc(id).remove();
			return res;
		} catch (e) {
			console.error('删除数据失败：', e);
			throw e;
		}
	}
}