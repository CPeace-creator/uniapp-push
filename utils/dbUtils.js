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


	async query(data) {
		const {
			query,
			where,
			orderBy,
			options,
			mainTable,
			secondTable,
			primaryField,
			secondaryField,
			queryConditions,
			mainField,
			secondField,
			tempField
		} = data
		console.log(data)
		try {
			let mainQuery = this.db.collection(this.tableName);
			let secondQuery;
			if (mainTable != "" && secondTable != "") {
				mainQuery = this.db.collection(mainTable).getTemp()
				secondQuery = this.db.collection(secondTable).getTemp()
			}
			if (mainField != "") {
				mainQuery = mainQuery.field(mainField)

			}
			if (secondField != "") {
				secondQuery = secondQuery.field(secondField)
			}
			if (query !== "") {
				mainQuery = mainQuery.where(query);
			}

			if (orderBy !== "") {
				mainQuery = mainQuery.orderBy(orderBy);
			}

			if (options !== "") {
				mainQuery = mainQuery.get(options);
			} else {
				mainQuery = mainQuery.get();
			}
			if (mainTable != "" && secondTable != "") {
				let res = await db.collection(mainQuery, secondQuery)
				if (tempField != "") {
					res = res.field(tempField)
				}
				return res.result
			} else {
				const res = await mainQuery;
				return res.result;
			}
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