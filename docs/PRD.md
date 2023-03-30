### Problematic ( issue )
    "Supposons que vous travaillez en équipe (par exemple: une équipe de développement, un groupe de révision pour les étudiants, un groupe de recherche scientifique, etc...) et que vous souhaitez collecter des informations (liens, fichiers, documents, codes, etc.) sur des sujets spécifiques pour les partager de manière rapide, digitale et confidentielle, tout en interagissant en temps réel entre les membres de l'équipe (commentaires, upvotes, mises à jour, etc.). Cependant, vous ne disposez d'aucun moyen de le faire en dehors des plateformes de médias sociaux ou de partage de ressources, qui le font de manière séparée ou désorganisée."

### Idea ( solution )
    "Créez une application web qui vous permet de créer un groupe et d'inviter vos collègues à travailler ensemble pour partager des informations et créer des publications qui peuvent être privées au sein du groupe ou publiques pour tous les utilisateurs de l'application. Les utilisateurs devraient pouvoir interagir en temps réel."

### Comparison among other paleformes ( issues )
    --GitHub
        ->independant : pour partager des repos avec les autres, les invités pourront rechercher sur le nom de votre repo et y accéder
        ->no dev team group
    --Facebook (public or private group)
        ->Les publications dans les groupes peuvent être publiques pour tous les utilisateurs de l'application ou privées pour les membres du groupe seulement(Mais dans cette application, l'authorisation est définie pour chaque publication individuellement. Les membres du groupe peuvent créer des publications publiques ou privées dans le groupe ou sur leur propre profile, selon leurs préférences)
        ->Effet psychologique: L'utilisateur peut être occupé ou gaspiller son temps avec d'autres services (video, social posts , ads, video games,friends posts, etc...) et peut quitter l'environnement de travail.
    --Discord (same for meta Messanger)
        ->Désorganisation des postes et leurs commentaires
        ->about group : just text-base messages and attached files
        ->no comments on posts (only you can reply to any post or message)
        



(en anglais)
### use case diagram :
.....actors : visitor , user , admin

.....fonctionnalites :
    -visitor : 
        ->list public posts(created by user in group or only in his own profile) main publics posts or profile publics posts  or group publics posts
        ->list Groups(with their descriptions and publics posts)
        ->list users profiles(with their descriptions , publics posts and groups) 
        ->create an acount
    -user [extends from visitor] (as visitor also):
        ->Web Auth
        ->get his profile (posts 'public and private' , description ,(groups and their friends) )
        ->create post(public or private within a group(and his profile) or in his profile only)
        ->delete his own post ( in group(and his profile) or his profile only)
        ->create Group(set as an admin)
        ->list his groups (with their descriptions and posts(publics and privates))
        ->send user request to the group(invite user to the group)
        ->send group request (demand to be a member in the group)
        ->join group(by accepting request) 
        ->update his own profile (description , UserName , email ...)
        ->delete his profile
        ->delete group(as an admin)
        ->update group(description , groupName, ...)

    -admin (extends from user):
        -> add user
        -> delete user
        -> generate settins

### class diagram
.....Entity:
    -> visitor , user , post , comment , upvote(like , star) , group

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
    groups : [string],
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
    groupId : string (optional)
    postedAt : Date,
    updateAt : Date,
    privacy : string : public | private, if private set groupId
    ...
}

# group {
    _id : string,
    groupName : string,
    description : string,
    usersId : [string],
    adminId : [string],
    createdAt : Date,
    postsId : [string]
    ...
}

# comment {
    _id : string,
    userId : string,
    content : string,
    createdAt : string,
    ...
}

# post like {
    userId : string,
    postId : string,
    Date
    ...
}

# comment like {
    userId : string,
    commentId : string,
    Date
    ...
}


