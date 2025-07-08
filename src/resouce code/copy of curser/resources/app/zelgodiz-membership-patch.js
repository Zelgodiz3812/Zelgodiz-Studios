// Zelgodiz Membership Patch
// This patch removes all payment restrictions by overriding membership type logic

(function() {
    'use strict';
    
    // Wait for the application to load
    function applyPatch() {
        // Override membership type constants
        if (typeof ja !== 'undefined') {
            // Store original values
            const originalFREE = ja.FREE;
            const originalPRO = ja.PRO;
            const originalPRO_PLUS = ja.PRO_PLUS;
            const originalENTERPRISE = ja.ENTERPRISE;
            const originalFREE_TRIAL = ja.FREE_TRIAL;
            const originalULTRA = ja.ULTRA;
            
            // Override to always return PRO
            ja.FREE = 'pro';
            ja.PRO = 'pro';
            ja.PRO_PLUS = 'pro_plus';
            ja.ENTERPRISE = 'enterprise';
            ja.FREE_TRIAL = 'pro';
            ja.ULTRA = 'ultra';
            
            console.log('Zelgodiz: Membership constants overridden');
        }
        
        // Override membership type functions
        if (typeof window !== 'undefined') {
            // Override global membership type function
            if (window.membershipType) {
                const originalMembershipType = window.membershipType;
                window.membershipType = function() {
                    return 'pro';
                };
                console.log('Zelgodiz: Global membershipType overridden');
            }
            
            // Override reactive membership type
            if (window.reactiveMembershipType) {
                const originalReactive = window.reactiveMembershipType;
                window.reactiveMembershipType = function() {
                    return 'pro';
                };
                console.log('Zelgodiz: Reactive membership type overridden');
            }
        }
        
        // Override authentication service membership type
        if (typeof window !== 'undefined' && window.cursorAuthenticationService) {
            const authService = window.cursorAuthenticationService;
            if (authService.membershipType) {
                const originalAuthMembership = authService.membershipType;
                authService.membershipType = function() {
                    return 'pro';
                };
                console.log('Zelgodiz: Authentication service membership type overridden');
            }
        }
        
        // Override any membership type checks
        const originalIncludes = Array.prototype.includes;
        Array.prototype.includes = function(searchElement, fromIndex) {
            if (searchElement === 'free' || searchElement === 'FREE') {
                return originalIncludes.call(this, 'pro', fromIndex);
            }
            return originalIncludes.call(this, searchElement, fromIndex);
        };
        
        console.log('Zelgodiz Patch Applied: All users now have PRO access');
    }
    
    // Apply patch when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPatch);
    } else {
        applyPatch();
    }
    
    // Also apply patch after a delay to catch late-loaded components
    setTimeout(applyPatch, 1000);
    setTimeout(applyPatch, 3000);
    setTimeout(applyPatch, 5000);
    
})(); 