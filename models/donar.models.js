const mongoose = require('mongoose');

const donarSchema = new mongoose.Schema({
  name: { type: String, 
    required: true 
  },
  bloodGroup: { type: String, 
    required: true 

  },
  dob: { type: Date, 
    required: true 

  },
  phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/ 
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
  country: { type: String, 
    
  },
  state: { type: String, 


  },
  district: { type: String, 


  },
  city: { type: String, 
 

  },
  pincode: { type: String, 
   

  },
  availability: { type: Boolean, 

  }
}, { timestamps: true });

module.exports = mongoose.model('Donar', donarSchema);