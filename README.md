# Time Manager App
<a id="readme-top"></a>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/time-manager">
    <img src="tm_readme_assets/logo_only.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Time Manager</h3>

  <p align="center">
    A time manager tool that incorporates the <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique"><strong>Pomodoro Technique</strong></a>.
    <br />

  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Time Manager Animation][time-manager-animation]

Managing time, especially as a solo learner, can be challenging. I wanted to have a tool that would do the following: 
* Provide a customizable daily schedule that is a blend of routine tasks and ad-hoc tasks and meetings.
* Will provide a reminder (visual and auditory) when it is time to change tasks.
* Incorporate breaks by default. This is a reminder that 3-5 minutes away from a task is often crucial to recharge and regain perspective
* Allow the flexibility for **pausing**, **continuing** and **completing tasks early** as the flow of a day is never predictable.

Of course, the primary goal of this project was to build upon the very basic fundamentals learned in bootcamp!

<p align="right">(<a href="#readme-top">back to top</a>)</p>




### Built With

* [![React][React.js]][React-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![Express][ExpressJS.com]][Express-url]
* [![MongoDB][MongoDB.com]][Mongo-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

**NOTE**: *This project is not complete and served strictly as personal learning project.*\
To get a local copy up and running follow these simple example steps.

### Prerequisites

Node and NPM are required.
  ```sh
  npm install npm@latest -g
  ```

### Installation

**NOTE:** _This was a learning project and not in any way a finished, secure or stable application._

1. Clone the repo
   ```sh
   git clone https://github.com/tonyb650/time_manager.git
   ```
2. Install NPM packages for `server` and `client` folders
   ```sh
   npm install
   ```
3. Create database with Mongo Community Edition or MongoDB Atlas
4. Create `server/.env` file and populate with environment variables
   ```json
    SECRET_KEY="create_a_secret_string_for_jwt"
    DB_URI="mongodb+srv://<user>:<db_string>@t<db_name>.<db>.mongodb.net/?retryWrites=true&w=majority"
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### The Task List
Red pushpin indicates a fixed task. The timing of unpinned tasks flows from the task before.
![Task List Screen Shot][task-list-screenshot]
### Create & Edit Each Task
![Task Entry Screen Shot][task-entry-screenshot]
### User Registration and Login
![User Auth Screen Shot][user-auth-screenshot]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

This was a learning project only and there will be no further development.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Tony Brierly

[![LinkedIn][linkedin-shield]][linkedin-url]

Project Link: [Time Manager](https://github.com/tonyb650/time-manager.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [So many YouTubers :)](https://youtube.com/)
* [Best Readme Template](https://github.com/othneildrew/Best-README-Template)
* [Choose an Open Source License](https://choosealicense.com)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[time-manager-animation]: tm_readme_assets/animation.gif
[task-list-screenshot]: tm_readme_assets/task-list-screenshot.png
[task-entry-screenshot]: tm_readme_assets/task-entry-screenshot.png
[user-auth-screenshot]: tm_readme_assets/user-auth-screenshot.png

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/tony-brierly

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com

[ExpressJS.com]: https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/

[MongoDB.com]: https://img.shields.io/badge/MongoDB-021e2b?style=for-the-badge&logo=mongodb&logoColor=00684a
[Mongo-url]: https://mongodb.com/