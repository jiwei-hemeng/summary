## 常用的mysql语句

连接数据库

```mysql
# mysql -h 主机地址 -u 用户名  -p 用户密码	
mysql -hlocalhost -uroot -p
```

退出MySQL数据库

```mysql
exit（回车）
```
查看该数据库下的表

```sql
show tables;
```

修改用户密码

```mysql
# mysqladmin -u 用户名 -p 旧密码 password 新密码
mysqladmin -u root -password ab12;
```

创建数据库

```mysql
# create database <数据库名>
create database book
```

显示数据库

```mysql
show databases;
```

删除数据库

```mysql
# drop database <数据库名>
drop database company;
```

选择数据库

```mysql
# use <数据库名>
use company;
```

创建数据表

```mysql
# create table <表名>
create table user;
# 完整的建表语句
CREATE TABLE `test_a` (
`id` char(32) NOT NULL COMMENT '主键ID',
`work_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增列',
`creator_id` char(32) DEFAULT NULL COMMENT '创建人',
`modifier_id` char(32) DEFAULT NULL COMMENT '修改人',
`status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态:1 启动 0 停用',
`deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除标记：0、未删除 1、已删除',
`handle_mission` tinyint(1) unsigned zerofill DEFAULT NULL COMMENT '手动完成，0，正常上刊任务；1，手动完成任务',
`signed_customer` varchar(64) DEFAULT NULL COMMENT '签约客户',
`created_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`updated_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
# 主键索引
PRIMARY KEY (`id`) USING BTREE,
# 唯一索引
UNIQUE KEY `index_id` (`id`) USING BTREE,
# 索引
KEY `index_signed_customer` (`signed_customer`) USING BTREE,
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4
```

获取数据库表结构

```mysql
# desc <表名>;
desc user;
# 或者使用
show columns from user;
# 获取完整的数据库表结构
show full columns from user;
```

删除数据表

```mysql
# drop table <表名>	
drop table info;
# 如果该表存在就删除该表
drop table if exists company;
```

向数据表中插入数据

```mysql
# insert into <表名> [(字段名1)[,...字段名n])] value (值1）[,(值n)];
insert into student (id,name,age) value (1,'张三',13),(3, "王五", 28);
insert into student set id=2,name="李四",age=100;
```

查询数据表中的数据

```mysql
# select <字段1，字段2，...> from <表名> where <条件>; 	
select * from student;
```

修改数据表中的数据

```mysql
# update 表名 set 字段=新值,... where 条件;	
update student set age=20 where id=1;
```

增加字段（添加列）:

```mysql
# alter table 表名 add 字段 类型 其他;	
alter table student add address varchar(40) default null;
```

修改字段

```sql
# alter table [表名] modify [字段名] [类型] comment '是否发送OA';
alter table msg_type_config modify oa_flag tinyint(3) unsigned comment '是否发送OA';
# 修改表名
alter table test_a rename to test_b;
# 修改表注释
alter table test_a comment 'test_a字段注释';
```

删除字段  (删除列) :

```mysql
alter table student drop column nickName;
```

加主关键字

```mysql
# alter table 表名 add primary key (字段名);	
alter table student add primary key (id);
```

加唯一限制条件

```mysql
# alter table 表名 add unique 索引名（字段名）;	
alter table student add unique emp_name2(id);
```

修改数据库表名

```mysql
# rename table 原表名 to 新表名;
rename table student to stu;
```

删除记录

```mysql
# delete from 表名 where 表达式;
delete from student where id=1;
```

导出数据库

```mysql
# mysqldump -u 用户名 -p 数据库名 > 导出的文件名
mysqldump -uroot -p  company > 123.sql
```

导出数据表

```mysql
# mysqldump -u 用户名 -p 数据库名 表名>导出的文件名
mysqldump -uroot -p company admin > outfile.sql
```

查看第n行后的m条记录

```mysql
# select * from <表名> limit row,rows;
select * from student limit n,m;
```

