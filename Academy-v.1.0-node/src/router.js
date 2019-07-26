const express = require('express');
const db = require("./database.js");

const router = express.Router();

// в коллбеках хенлдеров не обязательно использовать next если он не вызывается, это засоряет код

router.get("/api/articles", (req, res, next) => {
    const sql = "select * from article";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(403).json({"error":err.message});
          return;
        }
        res.json({
            "message":"Успешно",
            "data":rows
        })
      });
});

// Отсутствует проверка входящих данных
// В случае если статьи с таким id нет - следует возвращать 404
// Необходимо добавить валидацию параметра id и его принудительное приведение к числовому типу
router.get("/api/article/:id", (req, res, next) => {
    const sql = `select * from article where id = ${req.params.id}`;
    const params = [];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(403).json({"error":err.message});
          return;
        }
        console.log('row: ', row);
        res.json({
            "message":"Успешно",
            "data":row
        });
      });
});

// Отсутствует автозаполнение колонки date в случае если эта информация не была передана в запросе
// Необходимо принудительное приведение параметров title, body и date к строкам

router.post("/api/article/", (req, res, next) => {
    const errors=[];
    if (!req.body.title){
        errors.push("title обязательно");
    }
    if (!req.body.body){
        errors.push("body обязателен");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const data = {
        title: req.body.title,
        body: req.body.body,
        date: req.body.date
    };
    const sql ='INSERT INTO article (title, body, date) VALUES (?,?,?)';
    const params =[data.title, data.body, data.date];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(403).json({"error": err.message});
            return;
        }
        res.json({
            "message": "Успешно",
            "data": data,
            "id" : this.lastID
        });
    });
});

// Отсутствует проверка входящих данных
// Если не указан id - запрос все равно проходит успешно
// Необходимо удостовериться в наличии параметра id и соотв. записи перед ее редактированием
// Либо проверять кол-во измененных записей после запроса и в случае их отсутствия - возвращать ошибку
// Метод PUT здесь не совсем уместен - лучше использовать PATCH
router.put("/api/article/:id", (req, res, next) => {
    const data = {
        title: req.body.title,
        body: req.body.body
    };
    console.log(data);
    db.run(
        `UPDATE article set 
           title = COALESCE(?,title),
           body = COALESCE(?,body)
           WHERE id = ?`,
        [data.title, data.body, req.params.id],
        (err, result) => {
            if (err){
                console.log(err);
                res.status(403).json({"error": res.message});
                return;
            }
            res.json({
                message: "Успешно",
                data: data
            });
    });
});

router.delete("/api/article/:id", (req, res, next) => {
    db.run(
        'DELETE FROM article WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(403).json({"error": res.message});
                return;
            }
            res.json({"message":"Удалено", rows: this.changes});
    });
});

// Если никуда не попали
router.get("/", (req, res, next) => {
    res.json({"message":"Ok"});
});

module.exports = router;