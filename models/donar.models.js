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
    required: true 

  },
  district: { type: String, 
    required: true 

  },
  city: { type: String, 
    required: true 

  },
  pincode: { type: String, 
   

  },
  availability: { type: Boolean, 
    required: true 

  }
}, { timestamps: true });

module.exports = mongoose.model('Donar', donarSchema);
    
   