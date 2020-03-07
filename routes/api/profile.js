const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile/me
// @desc current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile
            .findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'No profile for this user' });
        }
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// @route POST api/profile/
// @desc create or update profile
router.post('/',
    [
        auth,
        [
            check('status', 'Status is required')
                .not()
                .isEmpty(),
            check('skills', 'Skills are required')
                .not()
                .isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubUsername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //Profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubUsername) profileFields.githubUsername = githubUsername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        console.log(profileFields.skills);

        //Social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.youtube = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                //Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }
            //Create
            profile = new Profile(profileFields);
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }

    });


// @route GET api/profile/
// @desc get all profiles

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile
            .find()
            .populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// @route GET api/profile/user/:user_id
// @desc get profile by user id
router.get('/user/:user_id', async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.user_id)) {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        const profile = await Profile
            .findOne({ user: req.params.user_id })
            .populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' })
        };
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/profile/
// @desc delete profile, user & posts

router.delete('/', auth, async (req, res) => {
    try {
        //Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });

        //Remove User
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// @route PUT api/profile/experience
// @desc Add profile experience
router.put('/experience',
    [
        auth,
        [
            check('title', 'Title is required').notEmpty(),
            check('company', 'Company is required').notEmpty(),
            check('from', 'From date is required').notEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.expirience.unshift(newExp);
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }

    });

// @route DELETE api/profile/experience
// @desc Delete profile experience
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        //if exp_id is valid ObjectId
        if (!ObjectId.isValid(req.params.exp_id)) {
            return res.status(400).json({ msg: 'Invalid experience id' })
        }

        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' })
        }

        const expToRemove = profile.expirience.find(exp => exp._id == req.params.exp_id);
        if (!expToRemove) {
            return res.status(400).json({ msg: 'Experience not found' })
        }

        await profile.expirience.remove(expToRemove._id);
        await profile.save();
        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// @route PUT api/profile/education
// @desc Add profile education
router.put('/education',
    [
        auth,
        [
            check('school', 'School is required').notEmpty(),
            check('degree', 'Degree is required').notEmpty(),
            check('fieldOfStudy', 'Field of study is required').notEmpty(),
            check('from', 'From date is required').notEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldOfStudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldOfStudy,
            from,
            to,
            current,
            description
        };
        console.log("test");

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }

    });

// @route DELETE api/profile/education
// @desc Delete profile education
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        //if edu_id is valid ObjectId
        if (!ObjectId.isValid(req.params.edu_id)) {
            return res.status(400).json({ msg: 'Invalid education id' })
        }

        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' })
        }

        const eduToRemove = profile.education.find(exp => exp._id == req.params.edu_id);
        if (!eduToRemove) {
            return res.status(400).json({ msg: 'Education not found' })
        }

        await profile.education.remove(eduToRemove._id);
        await profile.save();
        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/profile/github/:username
// @desc Get user repos from github
router.get('/github/:username', async (req, res) => {
    try {
        const url = `https://api.github.com/users/${req.params.username}/repos?
                     per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
                     &client_secret=${config.get('githubSecret')}`

        const response = await axios.get(url,
            {
                headers: { 'user-agent': 'node.js' },
                validateStatus: false
            })
            
        if (response.status != 200) {
            return res.status(404).json({ msg: 'No Github profile found' });
        }

        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;