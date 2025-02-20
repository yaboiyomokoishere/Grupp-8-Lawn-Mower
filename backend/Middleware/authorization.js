const { Permit } = require('permitio');

const permit = new Permit({
    token: 'permit_key_hUDWpkyt4VBZ7mi33UsgWTBBZpp34qQKfxHxyHJs9G2Mwx6YdFeNG0LGp1q7RZdZ6kodQbECPbNqaaF9mATUwH',
    pdp: 'https://cloudpdp.api.permit.io'
});

const authorization = (resource, action) => {
    return async (req, res, next) => {
        try {
            let user = req.user.role; 
            // Check permission using Permit.io:
            // https://app.permit.io/policy-editor
            const permitted = await permit.check(user, action, resource);
            //console.log(user)
            if (permitted) {
                next(); 
            } else {
                console.log("In authorization.js: Access denied");
                res.status(403).json({ error: "Access denied" });
            }
        } catch (error) {
            console.error("Permission check failed:", error);
            res.status(500).json({ error: "Authorization Error" });
        }
      };
}

module.exports = authorization;