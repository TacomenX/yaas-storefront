angular.module('ds.cart')
    .factory('CartNoteMixinSvc', ['$rootScope', 'CartSvc', 'CartREST', 'ProductSvc', 'AccountSvc', '$q', 'GlobalData',
        function ($rootScope, CartSvc, CartREST, ProductSvc, AccountSvc, $q, GlobalData) {
            
            // To be added to cart item's Metadata property
            var noteMixinMetadata = "https://api.yaas.io/hybris/schema/v1/kiwistest/example-schema.json";
            // The actual note
            var note = {
                code: ""
            };
            
            return {
                updateNote: function(cartItem, noteContent){
                    console.log("UpdateNote called");
                    var updatePromise = $q.defer();
                    
                    /*
                    console.log(cartItem);
                    
                    cartItem.metadata = cartItem.metadata || {};
                    cartItem.metadata.mixins = cartItem.metadata.mixins || {};
                    cartItem.metadata.mixins.note = noteMixinMetadata;
                    
                    cartItem.mixins = cartItem.mixins || {};
                    cartItem.mixins.note = note;
                    cartItem.mixins.note.code = noteContent; 

                    
                    console.log(cartItem);
                    */
                    var noteMixin = {
                        metadata: {
                            mixins: {
                                note: "https://api.yaas.io/hybris/schema/v1/kiwistest/example-schema.json"
                            }
                        },
                        mixins: {
                            note: {
                                code: noteContent
                            }
                        }
                    } 
                    
                    // Get cart info from CartSvc
                    var cart = CartSvc.getLocalCart();
                    var cartUpdateMode = 'auto';
                    var closeCartAfterTimeout = undefined;
                    
                    console.log(cart.id);
                    console.log(cartItem);
                    
                    CartREST.Cart.one('carts', cart.id)
                    .all('items')
                    .customPUT(noteMixin, cartItem.id + '?partial=true')
                    .then(function () {
                            CartSvc.refreshCart(cart.id, 'auto', closeCartAfterTimeout);
                            updatePromise.resolve();
                        }, 
                        function () {
                            /*
                            angular.forEach(cart.items, function (it) {
                                if (item.id === it.id) {
                                    item.error = true;
                                }
                            });
                            */
                            updatePromise.reject();
                        }
                    );
                    
                    return updatePromise.promise;
                }
            }
        }
    ]);