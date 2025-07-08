// Zelgodiz Patch - Remove Payment Restrictions
// This patch modifies the membership type logic to always return PRO access

// Override the membership type function to always return PRO
(function() {
    // Find the original membership type function
    const originalMembershipType = window.membershipType || function() { return 'free'; };
    
    // Override to always return PRO
    window.membershipType = function() {
        return 'pro';
    };
    
    // Override reactive membership type
    if (window.reactiveMembershipType) {
        const originalReactive = window.reactiveMembershipType;
        window.reactiveMembershipType = function() {
            return 'pro';
        };
    }
    
    // Override membership type constants
    if (window.ja) {
        window.ja.FREE = 'pro';
        window.ja.PRO = 'pro';
        window.ja.PRO_PLUS = 'pro_plus';
        window.ja.ENTERPRISE = 'enterprise';
        window.ja.FREE_TRIAL = 'pro';
        window.ja.ULTRA = 'ultra';
    }
    
    console.log('Zelgodiz Patch Applied: All users now have PRO access');
})(); 