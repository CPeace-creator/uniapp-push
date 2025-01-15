export default class DBUtils {

	constructor(tableName) {
		this.tableName = tableName;
		this.db = uniCloud.database();
	}


	async add(data) {
		try {
			const res = await this.db.collection(this.tableName).add(data);
			return res;
		} catch (e) {
			console.error('添加数据失败：', e);
			throw e;
		}
	}


	async query({
		query = "",
		where = "",
		orderBy = "",
		options = ""
	}) {
		try {
			let collectionQuery = this.db.collection(this.tableName);

			if (query !== "") {
				collectionQuery = collectionQuery.where(query);
			}

			if (orderBy !== "") {
				collectionQuery = collectionQuery.orderBy(orderBy);
			}

			if (options !== "") {
				collectionQuery = collectionQuery.get(options);
			} else {

				collectionQuery = collectionQuery.get();
			}

			const res = await collectionQuery;
			return res.result;
		} catch (e) {
			console.error('查询数据失败：', e);
			throw e;
		}
	}


	async update(id, data) {
		try {
			const res = await this.db.collection(this.tableName).doc(id).update(data);
			return res;
		} catch (e) {
			console.error('更新数据失败：', e);
			throw e;
		}
	}


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