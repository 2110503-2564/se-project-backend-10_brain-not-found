const { getRequests } = require('../controllers/requests');
const Request = require('../models/Request');

jest.mock('../models/Request', () => ({
    find: jest.fn()
}));

describe('getRequests controller', () => {
    let req, res, next;
    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const createFakeQuery = (fakeData) => ({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue(Promise.resolve(fakeData))
    });

    test('admin: with status query parameter', async () => {
        req = {
            user: { role: 'admin', id: 'admin-id' },
            query: { status: 'approved' }
        };
        const fakeData = [{ id: '1', status: 'approved' }];
        const fakeQuery = createFakeQuery(fakeData);
        Request.find.mockReturnValue(fakeQuery);

        await getRequests(req, res, next);

        expect(Request.find).toHaveBeenCalledWith({ status: 'approved' });
        expect(fakeQuery.populate).toHaveBeenCalledWith([
            { path: 'user', select: 'name' }
        ]);
        expect(fakeQuery.select).toHaveBeenCalledWith('createdAt user reason shop status');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: fakeData });
    });

    test('admin: without status query parameter', async () => {
        req = {
            user: { role: 'admin', id: 'admin-id' },
            query: {}
        };
        const fakeData = [{ id: '2', status: 'pending' }, { id: '3', status: 'approved' }];
        const fakeQuery = createFakeQuery(fakeData);
        Request.find.mockReturnValue(fakeQuery);

        await getRequests(req, res, next);

        // When no filter is passed, find() is called without arguments.
        expect(Request.find).toHaveBeenCalledWith();
        expect(fakeQuery.populate).toHaveBeenCalledWith([
            { path: 'user', select: 'name' }
        ]);
        expect(fakeQuery.select).toHaveBeenCalledWith('createdAt user reason shop status');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: fakeData });
    });

    test('shopOwner: with status query parameter', async () => {
        req = {
            user: { role: 'shopOwner', id: 'shop1-id' },
            query: { status: 'pending' }
        };
        const fakeData = [{ id: '4', status: 'pending' }];
        const fakeQuery = createFakeQuery(fakeData);
        Request.find.mockReturnValue(fakeQuery);

        await getRequests(req, res, next);

        expect(Request.find).toHaveBeenCalledWith({ status: 'pending', user: 'shop1-id' });
        expect(fakeQuery.populate).toHaveBeenCalledWith([
            { path: 'user', select: 'name' }
        ]);
        expect(fakeQuery.select).toHaveBeenCalledWith('createdAt user reason shop status');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: fakeData });
    });

    test('shopOwner: without status query parameter', async () => {
        req = {
            user: { role: 'shopOwner', id: 'shop1-id' },
            query: {}
        };
        const fakeData = [{ id: '5', status: 'pending' }, { id: '6', status: 'rejected' }];
        const fakeQuery = createFakeQuery(fakeData);
        Request.find.mockReturnValue(fakeQuery);

        await getRequests(req, res, next);

        expect(Request.find).toHaveBeenCalledWith({ user: 'shop1-id' });
        expect(fakeQuery.populate).toHaveBeenCalledWith([
            { path: 'user', select: 'name' }
        ]);
        expect(fakeQuery.select).toHaveBeenCalledWith('createdAt user reason shop status');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: fakeData });
    });

    test('should handle errors', async () => {
        req = {
            user: { role: 'admin', id: 'admin-id' },
            query: {}
        };

        // Simulate an error during Request.find()
        Request.find.mockImplementation(() => {
            throw new Error('Test error');
        });

        await getRequests(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Test error' });
    });
});