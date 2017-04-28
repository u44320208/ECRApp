function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("TOKEN_EXPIRE", 2592000);
//define("TOKEN_EXPIRE", 3600);
define("FB_FOLLOW_TOPIC_NAME", 'FBFT_');
define("ADMIN_ACC_ID", 1);
// define caching key FIX_DOM_KEY
define("CACHING_ACC_ACCBYID", "ACC_ACCBYID");
define("CACHING_SUB_BYACCID", "SUB_BYACCID");
define("CACHING_POST_LOVEBYACCID", "POST_LOVEBYACCID");
define("CACHING_POST_FAVORITEBYACCID", "POST_FAVORITEBYACCID");
