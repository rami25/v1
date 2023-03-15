### Entity : User , Post , comment , feedback(like , dislike) , groupe.
### global (visitor) access to publics posts or users

### JSON model : 

# User {
    _id : string,
    first name : string,
    last name : string,
    userName : string,
    createdAt : Date,
    email : string,
    tel : string,
    birthday : Date,
    posts : [string],
    friends : [string],
    friends(lock, unlock) : bool,
    groupes : [string],
    haveInvitation: bool,
    role : string
    ...
}

# Post {
    _id : string,
    title : string,
    description : string,
    url : [string], if new add new field
    files : [string],
    userId : string, (unique),
    postedAt : Date,
    updateAt : Date,
    privacy : string : public | private, if private set groupId
    ...
}

# group {
    userId : [string],
    adminRole : string
    ...
}

# comment {
    _id : string,
    userId : string,
    postId : string,
    createdAt : string,
    ...
}

# post like {
    userId : string,
    postId : string,
    ...
}

# comment like {
    userId : string,
    commentId : string,
    ...
}