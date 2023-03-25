
### uses case diagram :
    actors : visitor , user , admin

### fonctionnalites :
    -visitor : 
        ->list publics posts(by user or group user)main publics posts or profile publics posts  or group publics posts
        ->list Groups(with theirs descriptions) and publics posts
        ->list users profiles(with their descriptions , publics posts and groups) 
        ->createAcount
    -user (as visitor also):
        ->Web Auth
        ->get his profile (posts 'public and private' , description ,(groups and theirs friends) )
        ->create post(public or private within a group(and his profile) or her profile only)
        ->delete his own post ( in group(and his profile) or his profile only)
        ->create Group(set as an admin)
        ->list his groups (with theirs descriptions and posts(publics and privates))
        ->send user request to the group(invite user)
        ->send group request
        ->join group(by accepting request) 
        ->update his own profile (description , UserName , email ...)
        ->delete his profile

    -admin (extends from user):
        -> add user
        -> delete user
        -> generate settings


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

