const knex = require('./knex.js');
//inserting data to specefied table
const insert = (table, data) => {
    console.log(table,data);
    
    return knex(table).insert(data);
};
//fetch all data from specefied table
const readAll = async (table) => {
    return await knex.select().table(table).then((result) => {
        return (result.length > 0) ? result : 'No Records Found';
    })
};
//fetch data of given id from specefied table
const read = (table, id) => {
    return knex.select().table(table).where('id', id).then((result) => {
        return (result.length > 0) ? result : {alert:`Record With Given Id Does Not Exsist in ${table} table.`};
    });
}
//update data of given id in specefied table
const update = (table, data, id) => {
    return knex.table(table).update(data).where('id', id).returning('*').then((result) => {
        return (result.length > 0) ? result : 'Record With Given Id Does Not Exsist';
    });
};
//delete data of given id from specefied table
const del = (table, id) => {
    return knex.delete().table(table).where('id', id).returning('*').then((result) => {
        return (result.length > 0) ? result : 'Record With Given Id Does Not Exsist';
    });
}
//fetch data based on condition eg. {'personId':id}
const readWhere = (table, filter) => {
    return knex.select().table(table).where(filter).returning('*').then((result) => {
        return (result.length > 0) ? result : {alert : `Unable to find Record with Given Search Critarea(filter) from ${table} Table.`};
    });
}
//Deletes Records based on condition eg. {'transactionId':id}
const deleteWhere = (table, filter) => {
    return knex.delete().table(table).where(filter).then((result) => {
        return (result.length > 0) ? result : `Unable to find Record with Given Search Critarea(filter) from ${table} Table.`;
    });
}
//Get Specific fields from table using given critarea
const getFields = (table,fields,filter) => {
    return knex.select(fields).table(table).where(filter).then((result)=>{
        return (result.length > 0) ? result : `Unable to find Record with Given Search Critarea(filter) from ${table} Table.`;
    });
}
module.exports = {
    insert,
    readAll,
    read,
    update,
    del,
    readWhere,
    deleteWhere,
    getFields
}