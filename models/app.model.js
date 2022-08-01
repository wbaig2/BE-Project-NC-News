const express = require('express');
const db = require('../db/connection');
const app = require('../app');

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;')
        .then(({ rows: topics }) => {
            return topics;
        })
}