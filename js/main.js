
let eventBus = new Vue()

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false,
        },
        details: {
            type: Array,
            required: false
        },
        shipping: {
            type: Array,
            required: false
        }
    },

    template: `
        <div>   
        <ul>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab"
            >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                </li>
            </ul>

        </div>
        <div v-show="selectedTab === 'Make a Review'"> 
            <product-review></product-review>
        </div>
        <div v-show="selectedTab === 'Details'">
            <product-details :details="details"></product-details>
            </div>
            <div v-show="selectedTab === 'Shipping'">
            <p>{{ shipping }}</p>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Details', 'Shipping'],
            selectedTab: 'Reviews',
        }
    },
})


Vue.component('product-review', {
    template: `

    <form class="review-form" @submit.prevent="onSubmit">
    
    <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
    <li v-for="error in errors">{{ error }}</li>
    </ul>
    </p>
    
    <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
    <label for="review">Review:</label>
    <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
    </select>
    </p>
    
    <p>
        <label for="recommend">Would you recommend this product?</label><br>
        <input type="radio" id="yes" value="Yes" v-model="recommend"> Yes
        <input type="radio" id="no" value="No" v-model="recommend"> No
    </p>
    
    <p>
    <input type="submit" value="Submit"> 
    </p>
    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        
        

        <div class="product-image">
            <img :src="image" :alt="altText" />
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>Shipping: {{ shipping }}</p>
            <p v-if="inStock">In stock</p>
            <p v-else>Out of Stock</p>

            
            
            <product-details :details="details"></product-details>
    
            
            
            
            <div class="color-box" 
                    v-for="(variant, index) in variants" 
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor }" 
                    @mouseover="updateProduct(index)">
            </div>

             <p>
                <label for="size">Size:</label>
                <select id="size" v-model="selectedSize" > // выбираем размер который нам надо 
                    <option v-for="size in sizes" :key="size">{{ size }}</option> // с помощью v-for выводим весь список размеров  
                </select>
            </p>
            
<!--                    <option value="S">S</option>-->
<!--                    <option value="M">M</option>-->
<!--                    <option value="L">L</option>-->
<!--                    <option value="XL">XL</option>-->
<!--                    <option value="XXL">XXL</option>-->
            

            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
            <button v-on:click="deleteToCart">Delete to cart</button>
        </div>


        <div>
            <product-tabs :reviews="reviews" :details="details" :shipping="shipping" :addReview="addReview"></product-tabs> 
            

    </div>
    `,
    data() {
        return {

            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            selectedSize: '', // добавил переменную для хранения выбранного размера
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 1,
                    variantColor: 'green',
                    variantImage: "./assets/image/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,

                },
                {
                    variantId: 2,
                    variantColor: 'blue',
                    variantImage: "./assets/image/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 5,


                }
            ],
            reviews: [],
        }
    },
    methods: {
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },

        addToCart() {
            let cartDetails = {
                id: this.variants[this.selectedVariant].variantId,
                size: this.selectedSize
            };
            this.$emit('add-to-cart', cartDetails);

        },
        deleteToCart() {
            this.$emit('delete-to-cart', this.variants[this.selectedVariant].variantId);
        },

        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview);
        },



    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },

    },
    mounted(){
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })

    }
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true,
        },
    },
    template: `
        <ul>
            <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
        </ul>
    `,
});


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        delCart(id) {
            this.cart.pop(id);
        },
    }
});