const express = require('express');
const users = require("./userDb");
const router = express.Router();


router.post('/', validateUser(), (req, res) => {
  const body = {...req.body}
  users.insert(body)
    .then((users) => {
      res.status(201).json(users)
    })
    .catch((err) => next(err))
});

// NEEDS FIXING!
router.post('/:id/posts', validatePost(), validateUserId(), (req, res) => {

  const body = {...req.user, ...req.body}
  if(body){
    users.insert(body)
      .then((users) => {
        console.log("users: ", users)
        if(user){
          res.status(201).json(users)
        }
        else{
          res.status(400).json({message: "broke"})
        }
      })
      .catch((err) => {
        console.log("error in insert post", err)
        res.status(400).json({message: "shoot we broke"})
      })
  }
});

router.get('/', (req, res) => {
  users.get()
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      next(err)
    })

});

router.get('/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts',validateUserId(), (req, res) => {
  users.getUserPosts(req.params.id)
    .then((post) => {
      if( post.length === 0 ){
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          }
        ) 
      }
      else{
        res.status(200).json(post)
      }
    })
    .catch((err) => {next(err)})
});

router.delete('/:id', validateUserId(), (req, res) => {
  users.remove(req.params.id)
    .then((user) => {
      res.status(200).json({
        message: "This user is no more"
      })
    })
    .catch((err) => {next(err)})
});

router.put('/:id', (req, res) => {
  users.update(req.params.id, req.body)
    .then((user) => {
      if(user === 1){
        res.status(200).json({message: "user changed"})
      }
      else{
        res.status(400).json({message: "error while editing user"})
      }
    })
    .catch((err) => next(err))
});

//custom middleware

function validateUserId() {
  return(req, res, next) => {
    users.getById(req.params.id)
        .then((user) => {
            if(user){
                req.user = user
                next()
            }
            else{
                res.status(400).json({
                    message: "invalid user id"
                })
            }
        })
        .catch((err) => {
          next(err)
        })
}
}

function validateUser() {
  return(req, res, next) => {
    const user = req.body;

    if(Object.keys(user).length === 0){
      res.status(400).json({ message: "missing user data" })
    }
    else if (!user.name){
      res.status(400).json({
        message: "missing required name field"
      })
    }
    next()
  }
}

function validatePost() {
  return(req, res, next) => {
    const post = req.body;
    if(Object.keys(post).length === 0){
      res.status(400).json({ message: "missing post data" })
    }
    else if (!post.text){
      res.status(400).json({
        message: "missing required text field"
      })
    }
    next()
  }
}

module.exports = router;
