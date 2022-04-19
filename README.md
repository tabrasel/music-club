# Music Club Service

This project is a web service that provides a REST API for performing backend Music Club tasks, such as performing CRUD operations on the database or generating thumbnail images. It is available at [https://tb-music-club.herokuapp.com/](https://tb-music-club.herokuapp.com/).

## Contribution Process

1. Create a GitHub issue for the feature.

2. Create a new branch off of `dev` for the issue with the format: `#<issueNumber>-short-issue-name`.

3. Implement the feature. Try to make make clean and modular commits that follow [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) message formatting.

4. Document the feature in the CHANGELOG in the 'Unreleased' section.

## Deployment

The Music Club Service is hosted on Heroku as 'tb-music-club'. The API itself is available at the endpoint:
[https://tb-music-club.herokuapp.com/api](https://tb-music-club.herokuapp.com/api).

Only the `main` branch of the music-club-service repository should be deployed to production.

1. In your local repo, checkout the `dev` branch.

2. Move all items in the 'Unreleased' section of `CHANGELOG.md` to a new section with the current version number and date.  

3. In GitHub, open a pull request to merge `dev` into the `main` branch. Review and merge if everything looks good.

4. In your local repo, checkout the `main` branch and pull those changes you just merged.

5. Login to the Heroku CLI:
```
heroku login
```

6. If you don't have a Heroku remote for your music-club-service repository, create one:
```
heroku git:remote -a tb-music-club
```

7. Deploy the `main` branch of the repo to the Heroku remote:
```
git push heroku main
```

8. Visit [https://tb-music-club.herokuapp.com/api](https://tb-music-club.herokuapp.com/api) and make sure the welcome message appears.
