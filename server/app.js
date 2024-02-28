const multer = require('multer');
const xlsx = require('xlsx');
var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')//เข้าถึง json ที่ฝังใน body
var jsonParser = bodyParser.json()
const sql = require("mssql/msnodesqlv8");
const config = require("./config");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'Login-54321'

const port = 5000;

app.use(cors())

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const connection = sql.connect(config, (err) => {
    if (err) console.log(err);
});

app.get('/', async (req, res, next) => {
    res.send('<h1>Hello</h1>')
})

app.get('/api/combinelog', async (req, res, next) => {
    const page = parseInt(req.query.page);
    const per_page = parseInt(req.query.per_page);
    const sort_column = req.query.sort_column;
    const sort_direction = req.query.sort_direction;
    const search = req.query.search;
    const search_ring = req.query.search_ring;
    const search_suplot = req.query.search_suplot;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    const condition = req.query.condition;

    let condition_id = 0;
    if (condition === 'None') condition_id = 0;
    if (condition === 'Normal') condition_id = null;
    if (condition === 'Scraped') condition_id = 3;
    if (condition === 'Remelting') condition_id = 4;
    if (condition === 'Low ISA Shear') condition_id = 5;
    if (condition === 'Low COSA Shear') condition_id = 6;
    if (condition === 'Metal Burr') condition_id = 7;
    if (condition === 'Au Delamination') condition_id = 8;
    if (condition === 'Normal-NVI') condition_id = 9;

    try {
        const request = connection.request();
        const start_index = (page - 1) * per_page;
        let query = `SELECT TOP ${per_page} * FROM combineLog`;
        let whereConditions = [];

        if (!(start_date === 'NaN/NaN/N' && end_date === 'NaN/NaN/N')) {
            // Use BETWEEN operator for date range
            whereConditions.push(`LotDate BETWEEN '${start_date}' AND '${end_date}'`);
        } 
        if (search) {
            whereConditions.push(`IDMLotName LIKE '%${search}%'`);
        }
        if (search_ring) {
            whereConditions.push(`Output_Ring LIKE '%${search_ring}%'`);
        }
        if (search_suplot) {
            whereConditions.push(`Supplier_Lot LIKE '%${search_suplot}%'`);
        }
        if (condition_id !== 0) {
            if (condition_id === null) {
                whereConditions.push(`ActionID IS NULL`)
            } else {
                whereConditions.push(`ActionID = ${condition_id}`)
            }
        }
        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
            if (page > 1) {
                query += ` AND InvCOSARefID NOT IN (
                    SELECT TOP ${start_index} InvCOSARefID 
                    FROM combineLog
                    WHERE ${whereConditions.join(' AND ')}
                    ORDER BY ${sort_column} ${sort_direction}
                )`;
            }
        } else {
            if (page > 1) {
                query += ` WHERE InvCOSARefID NOT IN (
                    SELECT TOP ${start_index} InvCOSARefID 
                    FROM combineLog
                )`;
            }
        }
        if (sort_column && !whereConditions.length) {
            query += ` ORDER BY ${sort_column} ${sort_direction}`;
        }

        console.log(`LotDate BETWEEN '${start_date}' AND '${end_date}'`)

        query += ';';

        const result = await request.query(query);
        const dataAPI = result.recordset;

        total_query = 'SELECT COUNT(InvCOSARefID) as total FROM combineLog';
        if (whereConditions.length > 0) {
            total_query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        
        const total_result = await request.query(total_query);
        const totalAPI = total_result.recordset;
        const total = totalAPI[0]['total'];
        const total_pages = Math.ceil(total / per_page);

        // Inspection
        let totalGoodInspection = 0;
        let totalRejectInspection = 0;
        dataAPI.forEach(row => {
            totalGoodInspection += parseInt(row.GoodInspection);
            totalRejectInspection += parseInt(row.RejectInspection);
        });
        const finishInspection = totalGoodInspection + totalRejectInspection;

        // Usage All
        let totalGoodUsage = 0;
        let totalRejectUsage = 0;
        dataAPI.forEach(row => {
            totalGoodUsage += parseInt(row.GoodUsage);
            totalRejectUsage += parseInt(row.RejectUsage);
        });
        const usageAll = totalGoodUsage + totalRejectUsage;

        // Remain ALL
        let totalGoodRemain = 0;
        let totalRejectRemain = 0;
        dataAPI.forEach(row => {
            totalGoodRemain += parseInt(row.GoodRemain);
            totalRejectRemain += parseInt(row.RejectRemain);
        });
        const remainAll = totalGoodRemain + totalRejectRemain;

        //Remain Good
        let remainGood = 0;
        dataAPI.forEach(row => {
            remainGood += parseInt(row.GoodRemain)
        })

        //Remain Reject
        let remainReject = 0;
        dataAPI.forEach(row => {
            remainReject += parseInt(row.RejectRemain)
        })

        //Remain Normal
        let remainGoodNormal = 0;
        let remainRejectNormal = 0;
        dataAPI.forEach(row => {
            if (row.ActionID === null) {
                remainGoodNormal += parseInt(row.GoodRemain);
                remainRejectNormal += parseInt(row.RejectRemain);
            }
        });
        const remainAllNormal = remainGoodNormal + remainRejectNormal;

        //Remain Scraped
        let remainGoodScraped = 0;
        let remainRejectScraped = 0;
        dataAPI.forEach(row => {
            if (row.ActionID === 3) {
                remainGoodScraped += parseInt(row.GoodRemain);
                remainRejectScraped += parseInt(row.RejectRemain);
            }
        });
        const remainAllScraped = remainGoodScraped + remainRejectScraped;

        //Remain Remelting
        let remainGoodRemelting = 0;
        let remainRejectRemelting = 0;
        dataAPI.forEach(row => {
            if (row.ActionID === 4) {
                remainGoodRemelting += parseInt(row.GoodRemain);
                remainRejectRemelting += parseInt(row.RejectRemain);
            }
        });
        const remainAllRemelting = remainGoodRemelting + remainRejectRemelting;

        //Remain Low ISA Shear
        let remainGoodLowISAShear = 0;
        let remainRejectLowISAShear = 0;
        dataAPI.forEach(row => {
            if (row.ActionID === 5) {
                remainGoodLowISAShear += parseInt(row.GoodRemain);
                remainRejectLowISAShear += parseInt(row.RejectRemain);
            }
        });
        const remainAllLowISAShear = remainGoodLowISAShear + remainRejectLowISAShear;

        //Remain Low COSA Shear
        let remainGoodLowCOSAShear = 0;
        let remainRejectLowCOSAShear = 0;
        dataAPI.forEach(row => {
            if (row.ActionID === 6) {
                remainGoodLowCOSAShear += parseInt(row.GoodRemain);
                remainRejectLowCOSAShear += parseInt(row.RejectRemain);
            }
        });
        const remainAllLowCOSAShear = remainGoodLowCOSAShear + remainRejectLowCOSAShear;

        //Remain Metal Burr
        let remainGoodMetalBurr = 0;
        let remainRejectMetalBurr = 0;
        dataAPI.forEach(row => {
            if (row.ActionID === 7) {
                remainGoodMetalBurr += parseInt(row.GoodRemain);
                remainRejectMetalBurr += parseInt(row.RejectRemain);
            }
        });
        const remainAllMetalBurr = remainGoodMetalBurr + remainRejectMetalBurr;

        //Remain Au Delamination
        let remainGoodAuDelamination = 0;
        let remainRejectAuDelamination = 0;
        dataAPI.forEach(row => {
            if (row.ActionID === 8) {
                remainGoodAuDelamination += parseInt(row.GoodRemain);
                remainRejectAuDelamination += parseInt(row.RejectRemain);
            }
        });
        const remainAllAuDelamination = remainGoodAuDelamination + remainRejectAuDelamination;

        //Remain Normal-NVI
        let remainGoodNormalNVI = 0;
        let remainRejectNormalNVI = 0;
        dataAPI.forEach(row => {
            if (row.ActionID === 9) {
                remainGoodNormalNVI += parseInt(row.GoodRemain);
                remainRejectNormalNVI += parseInt(row.RejectRemain);
            }
        });
        const remainAllNormalNVI = remainGoodNormalNVI + remainRejectNormalNVI;

        res.json({
            page: page,
            per_page: per_page,
            total: total,
            total_pages: total_pages,
            finishInspection: finishInspection,
            usageAll: usageAll,
            remainAll: remainAll,
            remainGood: remainGood,
            remainReject: remainReject,
            remainGoodNormal: remainGoodNormal,
            remainRejectNormal: remainRejectNormal,
            remainAllNormal: remainAllNormal,
            remainGoodScraped: remainGoodScraped,
            remainRejectScraped: remainRejectScraped,
            remainAllScraped: remainAllScraped,
            remainGoodRemelting: remainGoodRemelting,
            remainRejectRemelting: remainRejectRemelting,
            remainAllRemelting: remainAllRemelting,
            remainGoodLowISAShear: remainGoodLowISAShear,
            remainRejectLowISAShear: remainRejectLowISAShear,
            remainAllLowISAShear: remainAllLowISAShear,
            remainGoodLowCOSAShear: remainGoodLowCOSAShear,
            remainRejectLowCOSAShear: remainRejectLowCOSAShear,
            remainAllLowCOSAShear: remainAllLowCOSAShear,
            remainGoodMetalBurr: remainGoodMetalBurr,
            remainRejectMetalBurr: remainRejectMetalBurr,
            remainAllMetalBurr: remainAllMetalBurr,
            remainGoodAuDelamination: remainGoodAuDelamination,
            remainRejectAuDelamination: remainRejectAuDelamination,
            remainAllAuDelamination: remainAllAuDelamination,
            remainGoodNormalNVI: remainGoodNormalNVI,
            remainRejectNormalNVI: remainRejectNormalNVI,
            remainAllNormalNVI: remainAllNormalNVI,
            data: dataAPI
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while executing the query' });
    }
});


app.get('/api/backup', jsonParser, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const per_page = parseInt(req.query.per_page);

        // Validate page and per_page values
        if (isNaN(page) || isNaN(per_page) || page <= 0 || per_page <= 0) {
            return res.status(400).json({ error: 'Invalid page or per_page parameters' });
        }

        const sort_column = req.query.sort_column;
        const sort_direction = req.query.sort_direction;
        const search = req.query.search;
        const search_ring = req.query.search_ring;
        const search_suplot = req.query.search_suplot;
        const start_date = req.query.start_date;
        const end_date = req.query.end_date;

        const request = connection.request();
        const start_index = (page - 1) * per_page;
        let query = `SELECT TOP ${per_page} * FROM backupFile`;
        let whereConditions = [];

        if (start_date && end_date) {
            // Use BETWEEN operator for date range
            whereConditions.push(`UplodeDate BETWEEN '${start_date}' AND '${end_date}'`);
        } else if (start_date) {
            whereConditions.push(`UplodeDate = '${start_date}'`);
        }
        if (search) {
            whereConditions.push(`IDMLotName LIKE '%${search}%'`);
        }
        if (search_ring) {
            whereConditions.push(`Output_Ring LIKE '%${search_ring}%'`);
        }
        if (search_suplot) {
            whereConditions.push(`Supplier_Lot LIKE '%${search_suplot}%'`);
        }

        whereConditions.push(`StatusID = 1`);

        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
            if (page > 1) {
                query += ` AND IDMLotID NOT IN (
                    SELECT TOP ${start_index} IDMLotID 
                    FROM importFile
                    ${whereConditions.length > 1 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
                    ORDER BY ${sort_column} ${sort_direction}
                )`;
            }
        } else {
            if (page > 1) {
                query += ` WHERE IDMLotID NOT IN (
                    SELECT TOP ${start_index} IDMLotID 
                    FROM importFile
                )`;
            }
        }
        if (sort_column && !whereConditions.length) {
            query += ` ORDER BY ${sort_column} ${sort_direction}`;
        }

        query += ';';

        const result = await request.query(query);
        const dataAPI = result.recordset;

        total_query = 'SELECT COUNT(IDMLotID) as total FROM importFile';
        if (whereConditions.length > 0) {
            total_query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        const total_result = await request.query(total_query);
        const totalAPI = total_result.recordset;
        const total = totalAPI[0]['total'];
        const total_pages = Math.ceil(total / per_page);

        res.json({
            page: page,
            per_page: per_page,
            total: total,
            total_pages: total_pages,
            data: dataAPI
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while executing the query' });
    }
});

app.get('/api/upload', jsonParser, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const per_page = parseInt(req.query.per_page);

        // Validate page and per_page values
        if (isNaN(page) || isNaN(per_page) || page <= 0 || per_page <= 0) {
            return res.status(400).json({ error: 'Invalid page or per_page parameters' });
        }

        const sort_column = req.query.sort_column;
        const sort_direction = req.query.sort_direction;
        const search = req.query.search;
        const search_ring = req.query.search_ring;
        const search_suplot = req.query.search_suplot;
        const start_date = req.query.start_date;
        const end_date = req.query.end_date;

        const request = connection.request();
        const start_index = (page - 1) * per_page;
        let query = `SELECT TOP ${per_page} * FROM importFile`;
        let whereConditions = [];

        if (start_date && end_date) {
            // Use BETWEEN operator for date range
            whereConditions.push(`UplodeDate BETWEEN '${start_date}' AND '${end_date}'`);
        } else if (start_date) {
            whereConditions.push(`UplodeDate = '${start_date}'`);
        }
        if (search) {
            whereConditions.push(`IDMLotName LIKE '%${search}%'`);
        }
        if (search_ring) {
            whereConditions.push(`Output_Ring LIKE '%${search_ring}%'`);
        }
        if (search_suplot) {
            whereConditions.push(`Supplier_Lot LIKE '%${search_suplot}%'`);
        }

        whereConditions.push(`StatusID = 3`);

        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
            if (page > 1) {
                query += ` AND IDMLotID NOT IN (
                    SELECT TOP ${start_index} IDMLotID 
                    FROM importFile
                    ${whereConditions.length > 1 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
                    ORDER BY ${sort_column} ${sort_direction}
                )`;
            }
        } else {
            if (page > 1) {
                query += ` WHERE IDMLotID NOT IN (
                    SELECT TOP ${start_index} IDMLotID 
                    FROM importFile
                )`;
            }
        }
        if (sort_column && !whereConditions.length) {
            query += ` ORDER BY ${sort_column} ${sort_direction}`;
        }

        query += ';';

        const result = await request.query(query);
        const dataAPI = result.recordset;

        total_query = 'SELECT COUNT(IDMLotID) as total FROM importFile';
        if (whereConditions.length > 0) {
            total_query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        const total_result = await request.query(total_query);
        const totalAPI = total_result.recordset;
        const total = totalAPI[0]['total'];
        const total_pages = Math.ceil(total / per_page);

        res.json({
            page: page,
            per_page: per_page,
            total: total,
            total_pages: total_pages,
            data: dataAPI
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while executing the query' });
    }
});


app.post('/register', jsonParser, (req, res, next) => {
    // Check if the UserID already exists in the database
    const checkQuery = `SELECT COUNT(*) AS count FROM Users WHERE UserID = '${req.body.id}'`;
    const checkRequest = connection.request();

    checkRequest.query(checkQuery, (checkErr, checkResults) => {
        if (checkErr) {
            res.json({ status: 'error', message: checkErr });
            return;
        }

        const userExists = checkResults.recordset[0].count > 0;

        if (userExists) {
            res.json({ status: 'error', message: 'User already exists' });
            return;
        }

        bcrypt.hash(req.body.password, saltRounds, (hashErr, hash) => {
            if (hashErr) {
                res.json({ status: 'error', message: hashErr });
                return;
            }

            const now = new Date();
            const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-` +
                `${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:` +
                `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            const UserID = req.body.id;
            const UserPwd = hash;
            const UserFname = req.body.fname;
            const UserLname = req.body.lname;
            const UserPhone = req.body.phone;
            const CreatedByID = req.body.id;

            const insertQuery = `INSERT INTO Users (UserID, UserPwd, UserFname, UserLname, UserPhone, CreatedDateTime, CreatedByID) 
                                VALUES ('${UserID}', '${UserPwd}', '${UserFname}', '${UserLname}', '${UserPhone}', '${formattedDate}', '${CreatedByID}')`;
            
            const request = connection.request();
            request.query(insertQuery, (insertErr, results) => {
                if (insertErr) {
                    res.json({ status: 'error', message: insertErr });
                    return;
                }
                res.json({ status: 'ok' });
            });
        });
    });
});


app.post('/login', jsonParser, async (req, res, next) => {
    try {
        const request = connection.request();
        const query = 'SELECT * FROM Users WHERE UserID = @UserID';
        request.input('UserID', req.body.id);
        const result = await request.query(query); // Use 'result' instead of 'users'
        const users = result.recordset; // Get the recordset from the result object
        
        if (users.length === 0) {
            res.json({ status: 'error', message: 'User Not found' });
            return;
        }

        // Make sure the users array is not empty before accessing its properties
        if (users[0] && users[0].UserPwd) {
            const isLogin = await bcrypt.compare(req.body.password, users[0].UserPwd);
            if (isLogin) {
                var token = jwt.sign({ id: users[0].id }, secret);//สามารถระบุตัวตนหรือกำหนดวันหมดอายุได้
                res.json({ status: 'ok', 
                            message: 'login success', 
                            token , 
                        });
            } else {
                res.json({ status: 'error', message: 'login failed' });
            }
        } else {
            res.json({ status: 'error', message: 'User not found or password not available' });
        }
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

app.post('/authen', jsonParser, (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]//split bearer
        var decoded = jwt.verify(token, secret);//verify
        res.json({status: 'ok' , decoded})
    } catch(err) {
        res.json({status: 'error', message: 'invalid signature'})
    }
})

app.delete('/api/delete/:IDMLotID', jsonParser, async (req, res, next) => {//(delete)
    const IDMLotID = req.params.IDMLotID;

    try {
        const request = connection.request();

        // Delete from InvCOSAInsp 
        const deleteInvCOSAInspQuery = `DELETE FROM InvCOSAInsp WHERE InvCOSARefID = @IDMLotID`;
        request.input('IDMLotID', IDMLotID);
        await request.query(deleteInvCOSAInspQuery);

        //Delete from InvCOSARemain
        const deleteInvCOSARemainQuery = `DELETE FROM InvCOSARemain WHERE InvCOSARefID = @IDMLotID`;
        await request.query(deleteInvCOSARemainQuery);

        //Delete from InvCOSAUsage
        const deleteInvCOSAUsageQuery = `DELETE FROM InvCOSAUsage WHERE InvCOSARefID = @IDMLotID`;
        await request.query(deleteInvCOSAUsageQuery);

        // Then delete from IDMLot
        const deleteIDMLotQuery = `DELETE FROM IDMLot WHERE IDMLotID = @IDMLotID`;
        await request.query(deleteIDMLotQuery);

        // Then delete from InvCOSARef
        const deleteInvCOSARefQuery = `DELETE FROM InvCOSARef WHERE IDMLotID = @IDMLotID`;
        await request.query(deleteInvCOSARefQuery);

        res.json({ status: 'ok', message: 'Data deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while deleting the data' });
    }
});

app.post('/api/status/:IDMLotID', jsonParser, async (req, res, next) => {
    const IDMLotID = req.params.IDMLotID;
    const userId = req.query.userId;

    const request = connection.request();
    const id_query = `SELECT id FROM Users WHERE UserID = '${userId}'`
    const id_result = await request.query(id_query);
    const id_user = id_result.recordset[0];
    const id = Object.values(id_user)[0]

    // console.log(IDMLotID, id )

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-` +
                `${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:` +
                `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    try {
        // const request = connection.request();

        // Delete from InvCOSAInsp 
        const deleteInvCOSAInspQuery = `update InvCOSAInsp 
                                        set StatusID = 1, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                        where InvCOSARefID = ${IDMLotID}`;
        await request.query(deleteInvCOSAInspQuery);

        //Delete from InvCOSARemain
        const deleteInvCOSARemainQuery = `update InvCOSARemain 
                                            set StatusID = 1, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                            where InvCOSARefID = ${IDMLotID}`;
        await request.query(deleteInvCOSARemainQuery);

        //Delete from InvCOSAUsage
        const deleteInvCOSAUsageQuery = `update InvCOSAUsage 
                                        set StatusID = 1, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                        where InvCOSARefID = ${IDMLotID}`;
        await request.query(deleteInvCOSAUsageQuery);

        // Then delete from IDMLot
        const deleteIDMLotQuery = `update IDMLot 
                                    set StatusID = 1, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                    where IDMLotID = ${IDMLotID}`;
        await request.query(deleteIDMLotQuery);

        // Then delete from InvCOSARef
        const deleteInvCOSARefQuery = `update InvCOSARef 
                                        set StatusID = 1, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                        where IDMLotID = ${IDMLotID}`;
        await request.query(deleteInvCOSARefQuery);

        res.json({ status: 'ok', message: 'Data deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while deleting the data' });
    }
});

app.post('/api/status-restore/:IDMLotID', jsonParser, async (req, res, next) => {
    const IDMLotID = req.params.IDMLotID;
    const userId = req.query.userId;
    console.log(userId)

    const request = connection.request();
    const id_query = `SELECT id FROM Users WHERE UserID = '${userId}'`
    const id_result = await request.query(id_query);
    const id_user = id_result.recordset[0];
    const id = Object.values(id_user)[0]

    console.log(IDMLotID, id )

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-` +
                `${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:` +
                `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    try {
        const request = connection.request();

        // Restore from InvCOSAInsp 
        const restoreInvCOSAInspQuery = `update InvCOSAInsp 
                                        set StatusID = 3, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                        where InvCOSARefID = ${IDMLotID}`;
        await request.query(restoreInvCOSAInspQuery);

        //Restore from InvCOSARemain
        const restoreInvCOSARemainQuery = `update InvCOSARemain 
                                            set StatusID = 3, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                            where InvCOSARefID = ${IDMLotID}`;
        await request.query(restoreInvCOSARemainQuery);

        //Restore from InvCOSAUsage
        const restoreInvCOSAUsageQuery = `update InvCOSAUsage 
                                        set StatusID = 3, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                        where InvCOSARefID = ${IDMLotID}`;
        await request.query(restoreInvCOSAUsageQuery);

        // Then Restore from IDMLot
        const restoreIDMLotQuery = `update IDMLot 
                                    set StatusID = 3, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                    where IDMLotID = ${IDMLotID}`;
        await request.query(restoreIDMLotQuery);

        // Then Restore from InvCOSARef
        const restoreInvCOSARefQuery = `update InvCOSARef 
                                        set StatusID = 3, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                        where IDMLotID = ${IDMLotID}`;
        await request.query(restoreInvCOSARefQuery);

        res.json({ status: 'ok', message: 'Data restored successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while deleting the data' });
    }
});

app.get('/api/history/:InvCOSARefID', async (req, res, next) => {
    const InvCOSARefID = req.params.InvCOSARefID;
    const page = parseInt(req.query.page);
    const per_page = parseInt(req.query.per_page);
    // const sort_column = req.query.sort_column;
    // const sort_direction = req.query.sort_direction;
    const start_index = (page - 1) * per_page;

    if (isNaN(page) || isNaN(per_page)) {
        res.status(400).json({ status: 'error', message: 'Invalid page or per_page parameter' });
        return;
    }

    try {
        const request = connection.request();
        let query = `
        SELECT *
        FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY CreatedDateTime DESC) AS RowNum
            FROM history
            WHERE InvCOSARefID = @InvCOSARefID) AS RankedResults
        WHERE RowNum > ${start_index} AND RowNum <= ${start_index + per_page}
    `;
        request.input('InvCOSARefID', InvCOSARefID);
        // console.log('Query:', query);

        const result = await request.query(query);
        const dataAPI = result.recordset.map((row) => {
            if (row.ActionID === 1) row.ActionID = 'Take';
            else if (row.ActionID === 2) row.ActionID = 'Return';
            else if (row.ActionID === 3) row.ActionID = 'Scraped';
            else if (row.ActionID === 4) row.ActionID = 'Remelting';
            else if (row.ActionID === 5) row.ActionID = 'Low ISA Shear';
            else if (row.ActionID === 6) row.ActionID = 'Low COSA Shear';
            else if (row.ActionID === 7) row.ActionID = 'Metal Burr';
            else if (row.ActionID === 8) row.ActionID = 'Au Delamination';
            else if (row.ActionID === 9) row.ActionID = 'Normal-NVI';

            //Extract the first 10 characters of CreatedDateTime
            // if (row.CreatedDateTime !== null) {
            //     row.CreatedDateTime = row.CreatedDateTime.toISOString().substring(0, 10);
            // }
            // Pad CreatedByID with leading zeros if its length is less than 10 characters
            // if (row.CreatedByID !== null) {
            //     row.CreatedByID = row.CreatedByID.toString().padStart(10, '0');
            // }
            if (row.CreatedByID !== null) {

            }
            return row;
            
        });

        total_query = 'SELECT COUNT(InvCOSARefID) as total FROM history WHERE InvCOSARefID = @InvCOSARefID';
        const total_result = await request.query(total_query, [InvCOSARefID]);
        const totalAPI = total_result.recordset;
        const total = totalAPI[0]['total'];
        const total_pages = Math.ceil(total / per_page);

        //COSA CODE
        code_query = `SELECT IDMLotName FROM lotFilter WHERE InvCOSARefID = ${InvCOSARefID}`;
        const code_result = await request.query(code_query);
        const cosa_code = code_result.recordset[0];

        //OUTPUT RING
        ring_query = `SELECT Output_Ring FROM lotFilter WHERE InvCOSARefID = ${InvCOSARefID}`;
        const ring_result = await request.query(ring_query);
        const output_ring = ring_result.recordset[0];

        //SUPPLIER LOT
        lot_query = `SELECT Supplier_Lot FROM lotFilter WHERE InvCOSARefID = ${InvCOSARefID}`;
        const lot_result = await request.query(lot_query);
        const supplier_lot = lot_result.recordset[0];

        //Good Inspection
        good_query = `SELECT GoodInspection FROM combineLog WHERE InvCOSARefID = ${InvCOSARefID}`;
        const good_result = await request.query(good_query);
        const good_inspection = good_result.recordset[0];

        //Reject Inspection
        reject_query = `SELECT RejectInspection FROM combineLog WHERE InvCOSARefID = ${InvCOSARefID}`;
        const reject_result = await request.query(reject_query);
        const reject_inspection = reject_result.recordset[0];

        //Reject Top
        top_query = `SELECT RejectTop FROM lotFilter WHERE InvCOSARefID = ${InvCOSARefID}`;
        const top_result = await request.query(top_query);
        const reject_top = top_result.recordset[0];

        //Reject Front
        front_query = `SELECT RejectFront FROM lotFilter WHERE InvCOSARefID = ${InvCOSARefID}`;
        const front_result = await request.query(front_query);
        const reject_front = front_result.recordset[0];

        //Reject Back
        back_query = `SELECT RejectBack FROM lotFilter WHERE InvCOSARefID = ${InvCOSARefID}`;
        const back_result = await request.query(back_query);
        const reject_back = back_result.recordset[0];

        //Reject Bottom
        bottom_query = `SELECT RejectBottom FROM lotFilter WHERE InvCOSARefID = ${InvCOSARefID}`;
        const bottom_result = await request.query(bottom_query);
        const reject_bottom = bottom_result.recordset[0];

        //Reject Multi
        multi_query = `SELECT RejectMulti FROM lotFilter WHERE InvCOSARefID = ${InvCOSARefID}`;
        const multi_result = await request.query(multi_query);
        const reject_multi = multi_result.recordset[0];

        //Reject LIV
        liv_query = `SELECT RejectLIV FROM lotFilter WHERE InvCOSARefID = ${InvCOSARefID}`;
        const liv_result = await request.query(liv_query);
        const reject_liv = liv_result.recordset[0];

        //---------------------------------Remain---------------------------------
        //Good Taken
        remain_good = `SELECT 
            ISNULL(SUM(CASE WHEN ActionID = 1 THEN GoodInspection ELSE 0 END), 0) -
            ISNULL(SUM(CASE WHEN ActionID BETWEEN 2 AND 8 THEN GoodInspection ELSE 0 END), 0) AS GoodInspection
                        FROM history
                        WHERE InvCOSARefID = ${InvCOSARefID};`;
        const remain_good_result = await request.query(remain_good);
        const good_remain = remain_good_result.recordset[0];

        //Top Taken
        remain_top = `SELECT 
                        ISNULL(SUM(CASE WHEN ActionID = 1 THEN RejectTop ELSE 0 END), 0) -
                        ISNULL(SUM(CASE WHEN ActionID BETWEEN 2 AND 8 THEN RejectTop ELSE 0 END), 0) AS RejectTop
                        FROM history
                        WHERE InvCOSARefID = ${InvCOSARefID};`;
        const remain_top_result = await request.query(remain_top);
        const top_remain = remain_top_result.recordset[0];

        //Front Taken
        remain_front = `SELECT 
                        ISNULL(SUM(CASE WHEN ActionID = 1 THEN RejectFront ELSE 0 END), 0) -
                        ISNULL(SUM(CASE WHEN ActionID BETWEEN 2 AND 8 THEN RejectFront ELSE 0 END), 0) AS RejectFront
                        FROM history
                        WHERE InvCOSARefID = ${InvCOSARefID};`;
        const remain_front_result = await request.query(remain_front);
        const front_remain = remain_front_result.recordset[0];

        //Front Taken
        remain_back = `SELECT 
                        ISNULL(SUM(CASE WHEN ActionID = 1 THEN RejectBack ELSE 0 END), 0) -
                        ISNULL(SUM(CASE WHEN ActionID BETWEEN 2 AND 8 THEN RejectBack ELSE 0 END), 0) AS RejectBack
                        FROM history
                        WHERE InvCOSARefID = ${InvCOSARefID};`;
        const remain_back_result = await request.query(remain_back);
        const back_remain = remain_back_result.recordset[0];

        //Bottom Taken
        remain_bottom = `SELECT 
                        ISNULL(SUM(CASE WHEN ActionID = 1 THEN RejectBottom ELSE 0 END), 0) -
                        ISNULL(SUM(CASE WHEN ActionID BETWEEN 2 AND 8 THEN RejectBottom ELSE 0 END), 0) AS RejectBottom
                        FROM history
                        WHERE InvCOSARefID = ${InvCOSARefID};`;
        const remain_bottom_result = await request.query(remain_bottom);
        const bottom_remain = remain_bottom_result.recordset[0];

        //Multi Taken
        remain_multi = `SELECT 
                        ISNULL(SUM(CASE WHEN ActionID = 1 THEN RejectMulti ELSE 0 END), 0) -
                        ISNULL(SUM(CASE WHEN ActionID BETWEEN 2 AND 8 THEN RejectMulti ELSE 0 END), 0) AS RejectMulti
                        FROM history
                        WHERE InvCOSARefID = ${InvCOSARefID};`;
        const remain_multi_result = await request.query(remain_multi);
        const multi_remain = remain_multi_result.recordset[0];

        //LIV Taken
        remain_liv = `SELECT 
                        ISNULL(SUM(CASE WHEN ActionID = 1 THEN RejectLIV ELSE 0 END), 0) -
                        ISNULL(SUM(CASE WHEN ActionID BETWEEN 2 AND 8 THEN RejectLIV ELSE 0 END), 0) AS RejectLIV
                        FROM history
                        WHERE InvCOSARefID = ${InvCOSARefID};`;
        const remain_liv_result = await request.query(remain_liv);
        const liv_remain = remain_liv_result.recordset[0];

        res.json({
            page: page,
            per_page: per_page,
            total: total,
            total_pages: total_pages,
            cosa_code: cosa_code.IDMLotName,
            output_ring: output_ring.Output_Ring,
            supplier_lot: supplier_lot.Supplier_Lot,
            good_inspection: good_inspection.GoodInspection,
            reject_inspection: reject_inspection.RejectInspection,
            reject_top: reject_top.RejectTop,
            reject_front: reject_front.RejectFront,
            reject_back: reject_back.RejectBack,
            reject_bottom: reject_bottom.RejectBottom,
            reject_multi: reject_multi.RejectMulti,
            reject_liv: reject_liv.RejectLIV,
            good_remain: good_remain.GoodInspection,
            top_remain: top_remain.RejectTop,
            front_remain: front_remain.RejectFront,
            back_remain: back_remain.RejectBack,
            bottom_remain: bottom_remain.RejectBottom,
            multi_remain: multi_remain.RejectMulti,
            liv_remain: liv_remain.RejectLIV,
            data: dataAPI
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while fetching the data' });
    }
});

app.post('/api/take/:invCOSARefID', jsonParser, async (req, res, next) => {
    try {
        const invCOSARefID = req.params.invCOSARefID;
        const good = req.query.good;
        const top = req.query.top;
        const front = req.query.front;
        const back = req.query.back;
        const bottom = req.query.bottom;
        const multi = req.query.multi;
        const liv = req.query.liv;
        const userId = req.query.userId;
        const condition = req.query.condition;
        const desc = req.query.description;
        const comment = req.query.comment;

        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-` +
            `${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:` +
            `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        const request = connection.request();

        const id_query = `SELECT id FROM Users WHERE UserID = '${userId}'`
        const id_result = await request.query(id_query);
        const id = id_result.recordset[0].id;

        action_id = 0;
        if (condition === 'Normal') action_id = 1;

        // console.log(action_id)
        // console.log(desc)
        // console.log(comment)

        const values = [];

        if (good !== undefined) values.push(`(${invCOSARefID}, 21, ${good},  ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (top !== undefined) values.push(`(${invCOSARefID}, 22, ${top},   ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (front !== undefined) values.push(`(${invCOSARefID}, 23, ${front}, ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (back !== undefined) values.push(`(${invCOSARefID}, 24, ${back},  ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (bottom !== undefined) values.push(`(${invCOSARefID}, 25, ${bottom},${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (multi !== undefined) values.push(`(${invCOSARefID}, 26, ${multi}, ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (liv !== undefined) values.push(`(${invCOSARefID}, 27, ${liv},   ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);

        const valuesClause = values.join(', ');

        const query = `INSERT INTO InvCOSAUsage (InvCOSARefID, ParaID, ParaVal, ActionID, StatusID, Purpose, Comment, CreatedDateTime, CreatedByID, UpdatedByID)
                        VALUES ${valuesClause}`;

        // console.log(query);

        await request.query(query);

        res.status(200).json({ message: req.query });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});



app.post('/api/return/:invCOSARefID', jsonParser, async (req, res, next) => {
    try {
        const invCOSARefID = req.params.invCOSARefID;
        const good = req.query.good;
        const top = req.query.top;
        const front = req.query.front;
        const back = req.query.back;
        const bottom = req.query.bottom;
        const multi = req.query.multi;
        const liv = req.query.liv;
        const userId = req.query.userId;
        const condition = req.query.condition;
        const desc = req.query.description;
        const comment = req.query.comment;
        console.log(condition)

        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-` +
            `${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:` +
            `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        const request = connection.request();

        const id_query = `SELECT id FROM Users WHERE UserID = '${userId}'`
        const id_result = await request.query(id_query);
        const id = id_result.recordset[0].id;

        action_id = 0;
        if (condition === 'Normal') action_id = 2;
        if (condition === 'Scraped') action_id = 3;
        if (condition === 'Remelting') action_id = 4;
        if (condition === 'Low ISA Shear') action_id = 5;
        if (condition === 'Low COSA Shear') action_id = 6;
        if (condition === 'Metal Burr') action_id = 7;
        if (condition === 'Au Delamination') action_id = 8;
        if (condition === 'Normal-NVI') action_id = 9;

        // console.log(action_id)

        const values = [];

        if (good !== undefined) values.push(`(${invCOSARefID}, 21, ${good},  ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (top !== undefined) values.push(`(${invCOSARefID}, 22, ${top},   ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (front !== undefined) values.push(`(${invCOSARefID}, 23, ${front}, ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (back !== undefined) values.push(`(${invCOSARefID}, 24, ${back},  ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (bottom !== undefined) values.push(`(${invCOSARefID}, 25, ${bottom},${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (multi !== undefined) values.push(`(${invCOSARefID}, 26, ${multi}, ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);
        if (liv !== undefined) values.push(`(${invCOSARefID}, 27, ${liv},   ${action_id}, 3, '${desc}', '${comment}', '${formattedDate}', ${id}, ${id})`);

        const valuesClause = values.join(', ');

        const query = `INSERT INTO InvCOSAUsage (InvCOSARefID, ParaID, ParaVal, ActionID, StatusID, Purpose, Comment, CreatedDateTime, CreatedByID, UpdatedByID)
                        VALUES ${valuesClause}`;

        // console.log(query);

        await request.query(query);

        res.status(200).json({ message: req.query });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.post('/import', upload.single('file'), async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetNameDate = 'Result VI + LIV ';
        const sheetName = 'Record';
        const worksheetDate = workbook.Sheets[sheetNameDate];
        const worksheet = workbook.Sheets[sheetName];
        const dataDate = xlsx.utils.sheet_to_json(worksheetDate, {
            range: "A3",      
            header: ["A3"],   
            blankRows: true,  
            defval: null,     
        });
        
        const data = xlsx.utils.sheet_to_json(worksheet, {
            range: 1,
            blankRows: true, // Include blank rows
            defval: null,    // Set default value for empty cells to null
        });

        if (data.length === 0) {
            return res.status(400).send('No data found in the Excel sheet');
        }

        const rowToInsert = Object.values(data[0]);
        const rowToInsertDate = dataDate[0].A3;
        // rowToInsert.splice(89, 1); // Delete value at index 78
        // console.log(rowToInsert)

        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-` +
            `${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:` +
            `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        const request = connection.request();

        const userId = req.query.userId;
        const id_query = `SELECT id FROM Users WHERE UserID = '${userId}'`
        const id_result = await request.query(id_query);
        const id = id_result.recordset[0].id;
        console.log(id)

        // IDMLot
        const query = `
            INSERT INTO IDMLot (ComTpID, IDMLotName, StatusID, CreatedDateTime, CreatedByID) 
            VALUES (3, '${rowToInsert[6]}', 3, '${formattedDate}', ${id})
        `;
        await request.query(query);

        const idQuery = 'SELECT SCOPE_IDENTITY() as IDMLotID;';
        const idResult = await request.query(idQuery);
        const idmLotID = idResult.recordset[0].IDMLotID;

        for (let i = 1; i <= 93; i++) {
            const paraVal = rowToInsert[i + 13] !== undefined ? `'${rowToInsert[i + 13]}'` : 'NULL';
            const insp_query = `INSERT INTO InvCOSAInsp (InvCOSARefID, ParaID, ParaVal, StatusID, CreatedDateTime, CreatedByID)
                                VALUES (${idmLotID}, ${i}, ${paraVal}, 3, '${formattedDate}', ${id})`;
            await request.query(insp_query);
        }

        // InvCOSARef
        const ref_query = `INSERT INTO InvCOSARef (IDMLotID, Output_Ring, Supplier_Lot, 
                    COSA_LotDate, InspectionDate, StatusID, CreatedDateTime, CreatedByID)
                    VALUES (${idmLotID}, '${rowToInsert[8]}', '${rowToInsert[9]}', 
                        '${rowToInsert[7]}', '${rowToInsert[5]}', 3, '${formattedDate}', ${id})`;
        await request.query(ref_query);

        // InvCOSARemain
        for (let i = 1; i <= 93; i++) {
            const paraVal = rowToInsert[i + 13] !== undefined ? `'${rowToInsert[i + 13]}'` : 'NULL';
            const remain_query = `INSERT INTO InvCOSARemain (InvCOSARefID, ParaID, ParaVal, StatusID, CreatedDateTime, CreatedByID)
                            VALUES (${idmLotID}, ${i}, ${paraVal}, 3, '${formattedDate}', ${id})`;
            await request.query(remain_query);
        }

        // //first time import
        // const rowHeader = Object.keys(data[0]);
        // // Enable IDENTITY_INSERT
        // await request.query('SET IDENTITY_INSERT Parameter ON');
        // console.log(rowHeader)
        // for (let i = 1; i <= 93; i++) {
        //     const paraName = rowHeader[i + 13] !== undefined ? `'${rowHeader[i + 13]}'` : 'NULL';
        //     const parameter_query = `INSERT INTO Parameter (ParaID, ParaName, StatusID, CreatedDateTime, CreatedByID)
        //                         VALUES (${i}, ${paraName}, 3, '${formattedDate}', ${id})`;
        //     await request.query(parameter_query);
        // }
        // // Disable IDENTITY_INSERT
        // await request.query('SET IDENTITY_INSERT Parameter OFF');

        res.status(200).send('Data inserted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.post('/update', upload.single('file'), async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = 'Record';
        const worksheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(worksheet, {
            range: 1,
            blankRows: true, // Include blank rows
            defval: null,    // Set default value for empty cells to null
        });

        if (data.length === 0) {
            return res.status(400).send('No data found in the Excel sheet');
        }

        const rowToInsert = Object.values(data[0]);
        // rowToInsert.splice(89, 1); // Delete value at index 78
        // console.log(rowToInsert)

        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-` +
            `${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:` +
            `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        const request = connection.request();

        const userId = req.query.userId;
        const id_query = `SELECT id FROM Users WHERE UserID = '${userId}'`
        const id_result = await request.query(id_query);
        const id = id_result.recordset[0].id;

        // Get IDMLotID 
        const idm = req.query.IDMLotID;

        // IDMLot
        const query = `UPDATE IDMLot
                        SET UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                        WHERE IDMLotID = ${idm}`;
        await request.query(query);

        // InvCOSAInsp
        for (let i = 1; i <= 93; i++) {
            const paraVal = rowToInsert[i + 13] !== undefined ? `'${rowToInsert[i + 13]}'` : 'NULL';
            const insp_query = `UPDATE InvCOSAInsp 
                                SET ParaVal = ${paraVal}, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                                WHERE ParaID = ${i} AND InvCOSARefID = ${idm}`;
            await request.query(insp_query);
        }

        // InvCOSARef
        const ref_query = `UPDATE InvCOSARef
                            SET UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                            WHERE IDMLotID = ${idm}`;
        await request.query(ref_query);

        // InvCOSARemain
        for (let i = 1; i <= 93; i++) {
            const paraVal = rowToInsert[i + 13] !== undefined ? `'${rowToInsert[i + 13]}'` : 'NULL';
            const remain_query = `UPDATE InvCOSARemain 
                            SET ParaVal = ${paraVal}, UpdatedDateTime = '${formattedDate}', UpdatedByID = ${id}
                            WHERE ParaID = ${i} AND InvCOSARefID = ${idm}`;
            await request.query(remain_query);
        }
        console.log('update success')
        res.status(200).send('Data Updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.get('/api/datafile', async (req, res, next) => {
    const request = connection.request();
    const query = 'SELECT * FROM AllFile'
    const data = await request.query(query);
    const result = data.recordsets[0]

    res.json({
        data : result
    });
});

app.get('/api/popup/:IDMLotID', async (req, res, next) => {
    const IDMLotID = req.params.IDMLotID;

    try {
        const request = connection.request();

        //COSA CODE
        code_query = `SELECT IDMLotName FROM lotFilter WHERE InvCOSARefID = ${IDMLotID}`;
        const code_result = await request.query(code_query);
        const cosa_code = code_result.recordset[0];

        //OUTPUT RING
        ring_query = `SELECT Output_Ring FROM lotFilter WHERE InvCOSARefID = ${IDMLotID}`;
        const ring_result = await request.query(ring_query);
        const output_ring = ring_result.recordset[0];

        //SUPPLIER LOT
        lot_query = `SELECT Supplier_Lot FROM lotFilter WHERE InvCOSARefID = ${IDMLotID}`;
        const lot_result = await request.query(lot_query);
        const supplier_lot = lot_result.recordset[0];

        //Good Inspection
        good_query = `SELECT GoodInspection FROM combineLog WHERE InvCOSARefID = ${IDMLotID}`;
        const good_result = await request.query(good_query);
        const good_inspection = good_result.recordset[0];

        //Reject Inspection
        reject_query = `SELECT RejectInspection FROM combineLog WHERE InvCOSARefID = ${IDMLotID}`;
        const reject_result = await request.query(reject_query);
        const reject_inspection = reject_result.recordset[0];

        //Reject Top
        top_query = `SELECT RejectTop FROM lotFilter WHERE InvCOSARefID = ${IDMLotID}`;
        const top_result = await request.query(top_query);
        const reject_top = top_result.recordset[0];

        //Reject Front
        front_query = `SELECT RejectFront FROM lotFilter WHERE InvCOSARefID = ${IDMLotID}`;
        const front_result = await request.query(front_query);
        const reject_front = front_result.recordset[0];

        //Reject Back
        back_query = `SELECT RejectBack FROM lotFilter WHERE InvCOSARefID = ${IDMLotID}`;
        const back_result = await request.query(back_query);
        const reject_back = back_result.recordset[0];

        //Reject Bottom
        bottom_query = `SELECT RejectBottom FROM lotFilter WHERE InvCOSARefID = ${IDMLotID}`;
        const bottom_result = await request.query(bottom_query);
        const reject_bottom = bottom_result.recordset[0];

        //Reject Multi
        multi_query = `SELECT RejectMulti FROM lotFilter WHERE InvCOSARefID = ${IDMLotID}`;
        const multi_result = await request.query(multi_query);
        const reject_multi = multi_result.recordset[0];

        //Reject LIV
        liv_query = `SELECT RejectLIV FROM lotFilter WHERE InvCOSARefID = ${IDMLotID}`;
        const liv_result = await request.query(liv_query);
        const reject_liv = liv_result.recordset[0];

        res.json({
            cosa_code: cosa_code.IDMLotName.toString(),
            output_ring: output_ring.Output_Ring.toString(),
            supplier_lot: supplier_lot.Supplier_Lot.toString(),
            good_inspection: good_inspection.GoodInspection.toString(),
            reject_inspection: reject_inspection.RejectInspection.toString(),
            reject_top: reject_top.RejectTop.toString(),
            reject_front: reject_front.RejectFront.toString(),
            reject_back: reject_back.RejectBack.toString(),
            reject_bottom: reject_bottom.RejectBottom.toString(),
            reject_multi: reject_multi.RejectMulti.toString(),
            reject_liv: reject_liv.RejectLIV.toString(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while fetching the data' });
    }
});

app.get('/api/popup-delete/:IDMLotID', async (req, res, next) => {
    const IDMLotID = req.params.IDMLotID;

    try {
        const request = connection.request();

        //COSA CODE
        code_query = `SELECT IDMLotName FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const code_result = await request.query(code_query);
        const cosa_code = code_result.recordset[0];

        //OUTPUT RING
        ring_query = `SELECT Output_Ring FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const ring_result = await request.query(ring_query);
        const output_ring = ring_result.recordset[0];

        //SUPPLIER LOT
        lot_query = `SELECT Supplier_Lot FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const lot_result = await request.query(lot_query);
        const supplier_lot = lot_result.recordset[0];

        //Good Inspection
        good_query = `SELECT GoodInspection FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const good_result = await request.query(good_query);
        const good_inspection = good_result.recordset[0];

        //Reject Top
        top_query = `SELECT RejectTop FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const top_result = await request.query(top_query);
        const reject_top = top_result.recordset[0];

        //Reject Front
        front_query = `SELECT RejectFront FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const front_result = await request.query(front_query);
        const reject_front = front_result.recordset[0];

        //Reject Back
        back_query = `SELECT RejectBack FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const back_result = await request.query(back_query);
        const reject_back = back_result.recordset[0];

        //Reject Bottom
        bottom_query = `SELECT RejectBottom FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const bottom_result = await request.query(bottom_query);
        const reject_bottom = bottom_result.recordset[0];

        //Reject Multi
        multi_query = `SELECT RejectMulti FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const multi_result = await request.query(multi_query);
        const reject_multi = multi_result.recordset[0];

        //Reject LIV
        liv_query = `SELECT RejectLIV FROM lotFilterBackup WHERE InvCOSARefID = ${IDMLotID}`;
        const liv_result = await request.query(liv_query);
        const reject_liv = liv_result.recordset[0];

        res.json({
            cosa_code: cosa_code.IDMLotName.toString(),
            output_ring: output_ring.Output_Ring.toString(),
            supplier_lot: supplier_lot.Supplier_Lot.toString(),
            good_inspection: good_inspection.GoodInspection.toString(),
            reject_top: reject_top.RejectTop.toString(),
            reject_front: reject_front.RejectFront.toString(),
            reject_back: reject_back.RejectBack.toString(),
            reject_bottom: reject_bottom.RejectBottom.toString(),
            reject_multi: reject_multi.RejectMulti.toString(),
            reject_liv: reject_liv.RejectLIV.toString(),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'An error occurred while fetching the data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port:${port}`)
})