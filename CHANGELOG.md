# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

* Switched service host from Heroku to Google Cloud Platform.

## 2.0.0 - 2022-02-16

### Added

* `/api/spotify-album` endpoint.

### Changed

* `GET` endpoints now return non-mongoose-hydrated plain old JavaScript objects.

## 1.8.0 - 2022-01-30

### Added

* Query parameter validation to endpoints for: Albums, Clubs, Members, Rounds, Spotify.

## 1.7.0 - 2022-01-26

### Added

* `/api/spotify-album-tracks` endpoint.
* `/api/spotify-audio-features` endpoint.

### Changed

* Albums now store the additional fields: `artists`, `releaseDate`, `spotifyId`, `topDiskNumber`, `tracks`
