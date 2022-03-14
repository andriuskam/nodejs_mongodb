// Importuoju modulį skirtą env failui ir jame esantiems "vietiniams" kintamiesiems.
require('dotenv').config();

// Importuoju mongoose modulį.
const mongoose = require('mongoose');

// Prisijungiu prie Mongo DB atlas, naudodamas env vietinį kintamąjį.
mongoose.connect( process.env.MONGO_DB ).then(()=>console.log('Connected to MongoDB Database')).catch(error=>{console.log('Connection failed ', error)});

// Sukuriu kursų schemą.
const CourseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

// Inicijuoju duomenų bazės kolekciją/modelį, pavadinimu Course.
const Course = mongoose.model('Course', CourseSchema);

// Sukuriu kursą.
const create = async() => {
    // Atkomentuoju po vieną kursą, kad gražiai įsirašytų į Mongo DB, Course kolekcijoje, įrašas.
    const course = new Course(
        // {
        //     name: "Node.js Course",
        //     author: "Jolita",
        //     tags: ['node', 'backend'],
        //     isPublished: true
        // },
        // {
        //     name: "One more DB Course",
        //     author: "Kunc",
        //     tags: ['db', 'nosql'],
        //     isPublished: true
        // },
        // {
        //     name: "dotenv",
        //     author: "Jolita",
        //     tags: ['npm', 'dotenv'],
        //     isPublished: true
        // },
        // {
        //     name: "JS",
        //     author: "Mosh",
        //     tags: ['js', 'javascript'],
        //     isPublished: true
        // },
        // {
        //     name: "React",
        //     author: "Mosh",
        //     tags: ['js', 'javascript'],
        //     isPublished: true
        // }
    );

    const output = await course.save();
    console.log(output);
}

// Gaunu kursus.
const get = async() => {
    const output = await Course
    .find();
    console.log(output);
}

// Filtruoju kursus pagal specifinius nurodymus.
const filter_byDetails = async() => {
    const output = await Course
    .find( {author: 'Jolita', isPublished: true} );
    console.log(output);
}

// Filtruoju kursus pagal specifinius nurodymus.
const filter_byDetails_limited_sorted_selected = async() => {
    const output = await Course
    .find( {author: 'Jolita', isPublished: true} )
    .limit( 2 )
    .sort( {name: 1} )
    .select( {name: 1, tags: 1} );
    console.log(output);
}
// Filtruoju kursus pagal specifinius nurodymus, naudojant logines sąlygas.
const get_or_and_FilterByDetails = async() => {
    const output = await Course
    .find()
    // .or( [{author: "Mosh"}, {isPublished: true}] )
    .and( [{author: "Mosh"}, {isPublished: true}] );
    console.log(output);
}

// Filtruoju kursus pagal Regex. Prasideda simbolių kratiniu: Jolita.
const filter_byRegex_startsWithJolita_sorted_selected = async() => {
    const output = await Course
    .find( {author: /^Jolita/} )
    .sort( {name: 1} )
    .select( {author: 1, name: 1, tags: 1} );
    console.log(output);
}

// Filtruoju kursus pagal Regex. Baigiasi simboliu: i.
const filter_byRegex_startsWithJLetter_i_sorted_selected = async() => {
    const output = await Course
    .find( {name: /course$/i} )
    .sort( {name: 1} )
    .select( {author: 1, name: 1, tags: 1} );
    console.log(output);
}

// Filtruoju kursus pagal regex. Apima simbolius: db.
const filter_byRegex_contains_db_sorted_selected = async() => {
    const output = await Course
    .find( {name: /.*db.*/i} )
    .sort( {name: 1} )
    .select( {author: 1, name: 1, tags: 1} );
    console.log(output);
}

// Skaičiuoju įrašų kiekį.
const count = async() => {
    const output = await Course
    .find()
    .count();
    console.log(output);
}

// ..puslapiais..
const pagination = async() => {
    const pageNumber = 1;
    const pageSize = 2;
    const output = await Course
    .find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
    console.log(output);
}

// Atnaujina įrašą: 1 variantas.
const update_one = async(id) => {
    const course = await Course.findById(id);
    if(!course) return;

    if(course.isPublished) return;

    course.isPublished = true;
    course.author = "Another author";

    const output = await course.save();
    console.log(output);
}

// Atnaujina įrašą: 2 variantas.
const update_two = async(id) => {
    const output = await Course.updateOne(
        { _id: id },
        {$set: {
            author: "Updated author",
            isPublished: false
        }});
    console.log(output);
}

// Atnaujina įrašą: 3 variantas.
const update_three = async(id) => {
    const output = await Course.findByIdAndUpdate(id, {
        $set: {
            author: "Jack",
            isPublished: true
        }}, {new: true});
    console.log(output);
}

// Pašalina įrašą: 1 variantas.
const remove_one = async(id) => {
    const output = await Course.deleteOne({ _id: id });
    console.log(output);
}

// Pašalina įrašą: 2 variantas.
const remove_two = async(id) => {
    const output = await Course.findByIdAndRemove(id);
    console.log(output);
}

// Pašalina daugumą įrašų, pagal nurodytus kriterijus.
const remove_many = async(id) => {
    const output = await Course.deleteMany({
        isPublished: true
    });
    console.log(output);
}

// Metodų iškvietimai.

// create();
// get();        
// filter_byDetails();
// filter_byDetails_limited_sorted_selected();
// get_orFilterByDetails();
// filter_byRegex_startsWithJolita_sorted_selected();
// filter_byRegex_startsWithJLetter_i_sorted_selected();
// filter_byRegex_contains_db_sorted_selected();
// count();
// pagination();
// update_one('622fb0c9c7660420f526929e');
// update_two('622fb0e292d7e72e9ca824d8');
// update_three('622fb0e292d7e72e9ca824d8');
// remove_one('622fb0e292d7e72e9ca824d8');
// remove_two('622fb110311684655f4b8ba4');
// remove_many();