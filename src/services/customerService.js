const { sql, getConnection } = require('../config/db');
const model = require('../models/customerModel');

async function getAll() {
  const pool = await getConnection();
  const result = await pool.request().query(`SELECT * FROM ${model.tableName}`);
  return result.recordset;
}

// Standalone stored-proc caller: dbo.GetAllCustomers(@Id INT=0)
// This function is independent and does not depend on other service methods.
async function getAllFromProc(id = 0) {
  const pool = await getConnection();
  const request = pool.request();
  request.input('Id', sql.Int, id);
  const result = await request.execute('dbo.GetAllCustomers');
  return result.recordset;
}

async function getById(id) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`SELECT * FROM ${model.tableName} WHERE CustomerID=@id`);
  return result.recordset[0];
}

async function create(data) {
  const pool = await getConnection();
  await pool.request()
    .input('FullName', sql.NVarChar, data.FullName)
    .input('Phone', sql.NVarChar, data.Phone)
    .input('Email', sql.NVarChar, data.Email)
    .input('City', sql.NVarChar, data.City)
    .query(`INSERT INTO ${model.tableName} (FullName, Phone, Email, City)
            VALUES (@FullName, @Phone, @Email, @City)`);
}

async function update(id, data) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('FullName', sql.NVarChar, data.FullName)
    .input('Phone', sql.NVarChar, data.Phone)
    .input('Email', sql.NVarChar, data.Email)
    .input('City', sql.NVarChar, data.City)
    .query(`UPDATE ${model.tableName}
            SET FullName=@FullName, Phone=@Phone, Email=@Email, City=@City
            WHERE CustomerID=@id`);
}

async function remove(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query(`DELETE FROM ${model.tableName} WHERE CustomerID=@id`);
}

module.exports = { getAll, getAllFromProc, getById, create, update, remove };
