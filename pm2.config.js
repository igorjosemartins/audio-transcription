module.exports = {
    apps : [
        {
            name             : "api",
            script           : "./api.js",
            log_file         : "./logs/api.log",
            log_date_format  : "YYYY-MM-DD HH:mm:ss",
            log_type         : "json"
        },

        {
            name             : "worker",
            script           : "./src/worker.js",
            log_file         : "./logs/worker.log",
            log_date_format  : "YYYY-MM-DD HH:mm:ss",
            log_type         : "json"
        }
    ]
}